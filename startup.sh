# This script runs when the Docker container runs on a server
# It must run in SH, BASH, and ASH shells, so it uses odd syntax

neededvars="DEPLOY_NUMBER"
output="../loadbalancer"

# Check which vars are missing
set -e
for var in ${neededvars}
do
  value=$(eval echo \$$var)
  if [[ x${value} == x'' ]]
  then
    missing="\"$var\",$missing"
  fi
done
missing=$( echo "${missing}" | rev | cut -c 2- | rev )

# Print missing variables or start
if [[ x${missing} == x'' ]]
then
  STARTED_ON=$(date '+%Y-%m-%d %H:%M:%S')
  neededvars="STARTED_ON VERSION BUILD_NUMBER GIT_COMMIT ${neededvars}"
else
  echo "{\"MISSING_ENVIRONMENT_VARIABLES\":[${missing}]}" >&2
  exit 1
fi

# list variables for the
visiblevars=" STARTED_ON VERSION BUILD_NUMBER GIT_COMMIT DEPLOY_NUMBER"

# build the JSON healthcheck loadbalancer
contents=$( for var in ${visiblevars} ; do echo "\"${var}\":\"$(eval echo \$$var)\"," ; done | tr -d '\n' )
jsoncontents="{${contents%?}}"
echo "${jsoncontents}" > "${output}"
echo "STARTING_CONTAINER=${jsoncontents}"

# Make the variable replacements
#sed -i "s,__API_URL__,${API_URL},g" niwa-widgets/*js

# start container threads
node build/app.js


export TZ="Pacific/Auckland"
