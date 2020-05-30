
/***  Node http-proxy를 이용한 포트 기반 가상호스트 설정하기 ***/


const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxy();

//domain과 ip 배열
const options = [
    { host: 'example1.com', ip: 'http://172.0.0.1:3001/' },
    { host: 'example2.com', ip: 'http://172.0.0.1:3002/' },
    { host: 'example3.com', ip: 'http://172.0.0.1:3003/' },
]

//후이즈 공용 포트
const port = 80;

http.createServer(function(req, res) {
    try {
        let host = req.headers.host;
        console.log('host:::'+host);

        if( host.match(/www./) ){   //www 제거
            host = host.split('www.')[1];
        }

        //host에 해당하는 ip 값 가져옴
        let ip = options.filter((key) => {
            if( key.host.includes(host) ){
                //console.log(key.host);
                //console.log(key.ip);
                return key;
            }
        })[0].ip;
        //console.log('ip:::'+ip);

        proxy.web(req, res, {
            target: ip,
        });

    }catch(err){
        console.error(err);
    }
}).listen(port, () => {
    console.log(' server listening on port '+port);
});