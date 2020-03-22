export const config = {
    "title": "Maxwell DeVos | ThatOneSpot",
    "versionRelease": "TBD",
    "versionTitle": "alpha",
    "version": "1.0.0",
    "path": __dirname,
    "server": {
        "environment": process.env.NODE_ENVIRONMENT,
        "port": process.env.PORT,
        "domain": process.env.DOMAIN,
        "transport": process.env.TRANSPORT
    },
    "email": {
        "errorNotificationEmail": process.env.ERROREMAIL,
        "username": process.env.USERNAME,
        "password": process.env.PASSWORD,
        "from": process.env.FROM
    },
    "database": {
        "dbUrl": process.env.DATABASE_URL
    },
    "session": {
        "secret": process.env.SECRET
    },
    "okta": {
        "issuer": process.env.OKTA_ORG_URL,
        "client_id": process.env.OKTA_CLIENT_ID,
        "client_secret": process.env.OKTA_CLIENT_SECRET
    },
    "aws":{
        "client_id": process.env.AWS_CLIENT_ID,
        "client_secret": process.env.AWS_CLIENT_SECRET,
        "api_version": process.env.AWS_API_VERSION,
        "region": process.env.AWS_REGION,
        "bucket": process.env.AWS_BUCKET
    }
};