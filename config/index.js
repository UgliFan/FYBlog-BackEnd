var env = process.env.NODE_ENV || 'dev';

var config;
switch (env) {
  case 'dev':
    config = {
      env: 'dev',
      db:{
        server:'mongodb://139.196.165.203:27017/FYBlog',
        options:{
          user: 'fyq2yj',
          pass: '123456',
          server: { poolSize: 20 }
        }
      },
      account:{
        access_token_name_cookie:'__cfl_uid_dev',
        expire_time:1000*60*60,
        secret_key:'FYBlog_by_Fancy'
      }
    };
    break;
  default:
    config = {
      env: 'pro',
      db:{
        server:'mongodb://127.0.0.1:27017/FYBlog',
        options:{
          user: 'fyq2yj',
          pass: '123456',
          server: { poolSize: 20 }
        }
      },
      account:{
        access_token_name_cookie:'__cfl_uid_pro',
        expire_time:1000*60*60,
        secret_key:'FYBlog_by_Fancy'
      }
    };
    break;
}
module.exports = config;