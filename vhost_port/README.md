# Node http-proxy를 이용한 포트기반 가상호스트 설정하기
- server.js  

# 프록시(Proxy)란?
보안상으로 직접 통신할 수 없는 두 점 사이에서 중간에 대리로 통신을 수행하는 기능을 프록시라고 하며,  
중계 기능을 하는 중계기를 프록시 서버라고 한다.  
  

## 프록시 서버의 특징
클라이언트 <-> 프록시 서버 <-> 서버  
- 캐시를 이용하여 저장하므로 전송시간을 절약  
- 트래픽을 줄이기 때문에 네트워크 병목 현상 방지  



# 가상호스트(Virtual Host)란?
- 기본적으로 존재하는 메인 호스트를 제외한 나머지 호스트들  


## 이름기반의 가상호스트(Name-based virtual host)
- 하나의 IP 주소에 여러개의 가상호스트를 운용하는 것  
ex)   
    host        x.x.x.x  
      
    domain      www.example.com  
    domain      www.example.kr  
    domain      www.example.net  


## 주소기반의 가상호스트(Ip-based virtual host)
- 가상 호스트 각각에 하나씩의 IP 주소를 할당하여 운용하는 것  
ex)  
    host        x.x.x.x1  
    domain      www.example.com  
      
    host        x.x.x.x2  
    domain      www.example.kr  
      
    host        x.x.x.x3  
    domain      www.example.net  


## 포트기반의 가상호스트(Port-based virtual host)
- 하나의 호스트에 포트만 다르게 지정하여 운용하는 것  
ex)  
    main-host   x.x.x.x:80  
      
    host        x.x.x.x:8001  
    domain      www.example.com  
            
    host        x.x.x.x:8002  
    domain      www.example.kr  
      
    host        x.x.x.x:8003  
    domain      www.example.net  

   
## 기본 가상호스트(Default virtual host)
- 해당사항이 없는 호스트의 로딩요구를 받았을 때 기본으로 응답하게 될 호스트를 지정


