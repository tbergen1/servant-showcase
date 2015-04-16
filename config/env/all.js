module.exports = {
    app: {
        name: "Servant Boilerplate MEAN",
        description: '"A Servant Boilerplate Application Built On The MEAN Stack"',
        keywords: "servant, content, cloud, cms, data, blog, products, events",
        port: 3000,
        servant_connect_url: "https://www.servant.co/connect/oauth2/authorize?response_type=code&client_id=" + process.env.SERVANT_CLIENT_ID
    }
}