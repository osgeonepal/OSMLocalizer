# Decode SSH key
echo "${SSH_KEY}" | base64 -di > ssh_key
chmod 600 ssh_key # private keys need to have strict permission to be accepted by SSH agent

# Add production server to known hosts
echo "${SERVER_PUBLIC_KEY}" | base64 -di >> ~/.ssh/known_hosts

echo "Deploying via remote SSH"
ssh -i ssh_key "circleci@${SERVER_IP}" \
  "cd OSMLocalizer \
  && git pull origin circleci-project-setup
  && docker-compose down \
  && docker build -t localizer-backend:latest .  \
  && docker-compose up -d \
  && docker system prune -af" # remove unused images to free up space

echo "Successfully deployed, hooray!"
