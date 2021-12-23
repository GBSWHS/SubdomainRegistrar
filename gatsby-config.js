module.exports = {
  siteMetadata: {
    title: 'Subdomain Registrar',
    description: '.gbsw.hs.kr 서브도메인 &amp; SSL 인증서 연결',
    author: '@pmh-only',
    siteUrl: 'https://sub.gbsw.hs.kr'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-image',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-postcss',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'subdomain-registrar',
        short_name: 'subdomain',
        start_url: '/',
        background_color: '#fafafa',
        display: 'minimal-ui'
      }
    }
  ]
}
