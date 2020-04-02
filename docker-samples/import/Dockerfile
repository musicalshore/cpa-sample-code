FROM mongo:4.2.5
COPY ptrels.json /ptrels.json
EXPOSE 27017
CMD mongoimport --host mongo-epf --db patients --collection ptrels --type json --file /ptrels.json --jsonArray
