export const config = {
    "title": "Maxwell DeVos | ThatOneSpot",
    "versionRelease": "TBD",
    "versionTitle": "alpha",
    "version": "1.0.0",
    "server": {
        "enviroment": process.env.NODE_ENVIROMENT,
        "port": process.env.PORT,
        "domain": process.env.DOMAIN,
        "transport": process.env.TRANSPORT
    },
    "email": {
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
    }
};