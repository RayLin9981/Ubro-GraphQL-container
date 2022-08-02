#!/bin/sh






if [ -z $MYSQL_HOST ] || [ -z $MYSQL_USER ] || [ -z $MYSQL_PASSWD ] || [ -z $MYSQL_DATABASE ] || [ -z $SECRET ]; then
	echo '$MYSQL_HOST  $MYSQL_USER  $MYSQL_PASSWD $MYSQL_DATABASE $SECRET must be set!'
	exit 1
fi

sed -i -e " s/MYSQL_USER=/MYSQL_USER=$MYSQL_USER/" .env.example && \
sed -i -e " s/MYSQL_PASSWD=/MYSQL_PASSWD=$MYSQL_PASSWD/" .env.example && \
sed -i -e " s/MYSQL_DATABASE=/MYSQL_DATABASE=$MYSQL_DATABASE/" .env.example && \
sed -i -e " s/MYSQL_HOST=/MYSQL_HOST=$MYSQL_HOST/" .env.example && \
sed -i -e " s/SECRET=/SECRET=$SECRET/" .env.example 

mv .env.example .env


npm install
node graphql.js
