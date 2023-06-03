let joinStats = true; //Optional join statistics. Joining statistics will not collect any private information, only statistics of visits.
let webPath = 'https://raw.githubusercontent.com/johnnynetsec/NewBingGoGo-Web/master/src/main/resources'; //web page address, you can modify it to your own warehouse to customize the front-end page
let serverConfig = {
     "h1": "NewBingGoGo",
     "h2": "Simple start chatting with NewBing",
     "p": "",
     "firstMessages": [
         "Okay, I've cleared the board and can start over. What can I help you explore?",
         "Got it, I've erased the past and focused on the present. What should we explore now?",
         "It's always great to start over. Ask me any questions!",
         "Okay, I've reset my brain for new conversations. What would you like to talk about now?",
         "Fine, let's change the subject. What are you thinking?",
         "Thank you for helping me sort things out! What can I do to help you now?",
         "No problem, glad you enjoyed the last conversation. Let's move on to a new topic. What would you like to learn more about?",
         "Thank you! It's always helpful to know when you're ready to move on. What questions can I answer for you now?",
         "Of course, I'm ready for a new challenge. What can I do for you now?"
     ],
     "firstProposes":[
         "Teach me a new word",
         "I need help with homework",
         "I want to learn a new skill",
         "Which is the deepest ocean?",
         "How many hours are there in a year?",
         "How did the universe begin?",
         "Finding Nonfiction",
         "Why are flamingos pink?",
         "What's the news?",
         "Make me laugh",
         "Show me inspirational quotes",
         "What is the smallest mammal in the world?",
         "Show me recipes",
         "Which is the deepest ocean?",
         "Why do humans need sleep?",
         "Teach me about going to the moon",
         "I want to learn a new skill",
         "How to create a budget?",
         "Tell me a joke",
         "How do holograms work?",
         "How to set achievable goals?",
         "How were the pyramids built?",
         "encourage me!",
         "How did the universe begin?",
         "How to make a cake?"
     ]
}
let cookies = [
     ""
]


export default {
     async fetch(request, _env) {
         return await handleRequest(request);
     }
}
let serverConfigString = JSON. stringify(serverConfig);
/**
  * Respond to the request
  * @param {Request} request
  */
async function handleRequest(request) {
     let url = new URL(request.url);
     let path = url.pathname;

     if(path === '/challenge'){//Verified interface
         let r = url.searchParams.get('redirect');
         if (r){
             return getRedirect(r);
         }
         return new Response(`Verification succeeded`,{
             status: 200,
             statusText: 'ok',
             headers: {
                 "content-type": "text/html; charset=utf-8"
             }
         })
     }

     if (path === '/sydney/ChatHub') { // magic chat
         return goChatHub(request);
     }
     if (path === "/turing/conversation/create") { //create chat
         return goUrl(request, "https://www.bing.com/turing/conversation/create",{
             "referer": "https://www.bing.com/search?q=Bing+AI"
         });
     }

     if(path==="/edgesvc/turing/captcha/create"){//request verification code picture
         return goUrl(request,"https://edgeservices.bing.com/edgesvc/turing/captcha/create",{
             "referer": "https://edgeservices.bing.com/edgesvc/chat?udsframed=1&form=SHORUN&clientscopes=chat,noheader,channelstable,&shellsig=709707142d65bbf48ac1671757ee0fd1996e2943&setlang=zh-CN&lightschemeovr=1 "
         });
     }
     if(path==="/edgesvc/turing/captcha/verify"){//Submit verification code
         return goUrl(request,"https://edgeservices.bing.com/edgesvc/turing/captcha/verify?"+url.search,{
             "referer": "https://edgeservices.bing.com/edgesvc/chat?udsframed=1&form=SHORUN&clientscopes=chat,noheader,channelstable,&shellsig=709707142d65bbf48ac1671757ee0fd1996e2943&setlang=zh-CN&lightschemeovr=1 "
         });
     }

     if (path.startsWith('/msrewards/api/v1/enroll')) { // join the alternate
         return goUrl(request, "https://www.bing.com/msrewards/api/v1/enroll" + url.search);
     }
     if (path === '/images/create') { //AI drawing
         return goUrl(request, "https://www.bing.com/images/create" + url.search, {
             "referer": "https://www.bing.com/search?q=bingAI"
         });
     }
     if (path.startsWith('/images/create/async/results')) { //Request AI to draw pictures
         url.hostname = "www.bing.com";
         return goUrl(request, url.toString(), {
             "referer": "https://www.bing.com/images/create?partner=sydney&showselective=1&sude=1&kseed=7000"
         });
     }
     if (path.startsWith('/rp')) { //Display AI drawing error prompt picture
         url.hostname = "www.bing.com";
         return goUrl(request, url.toString(), {
             "referer": "https://www.bing.com/search?q=bingAI"
         });
     }
     // for testing
     if (path. startsWith("/test/")) {
         let a = path.replace("/test/",'');
         return goUrl(request, a);
     }
     //Request server configuration
     if(path==='/web/resource/config.json'){
         return new Response(serverConfigString,{
             status: 200,
             statusText: 'ok',
             headers: {
                 "content-type": "application/x-javascript; charset=utf-8",
                 "cache-control": "max-age=14400"
             }
         })
     }
     if (path.startsWith("/web/")||path === "/favicon.ico") { //web request
         if(!joinStats){
             if(path==="/web/js/other/stats.js"){
                 return new Response("console.log(\"Not included in statistics\");",{
                     status: 200,
                     statusText: 'ok',
                     headers: {
                         "content-type": "application/x-javascript; charset=utf-8",
                         "cache-control": "max-age=14400"
                     }
                 })
             }
         }
         let a = `${webPath}${path}`;
         return await goWeb(a);
     }
     return getRedirect('/web/NewBingGoGo.html');
}


async function goWeb(path) {
     let res = await fetch(path);
     let mimeType;
     if (path. endsWith(".html")) {
         mimeType = "text/html; charset=utf-8";
     } else if (path. endsWith(".js")) {
         mimeType = "application/x-javascript; charset=utf-8";
     } else if (path. endsWith(".css")) {
         mimeType = "text/css; charset=utf-8";
     } else if (path. endsWith(".png")) {
         mimeType = "image/png";
     } else if (path. endsWith(".ico")) {
         mimeType = "image/png";
     }
     return new Response(res. body, {
         status: 200,
         statusText: 'ok',
         headers: {
             "content-type": mimeType,
             "cache-control": "max-age=14400"
         }
     });
}


async function goChatHub(request){
     let url = new URL(request.url);
     //Build fetch parameters
     let fp = {
         method: request. method,
         headers: {
             "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.57",
             "Host": "sydney.bing.com",
             "Origin": "https://www.bing.com"
         }
     }
     //keep the header information
     let reqHeaders = request. headers;
     let dropHeaders = ["Accept-Language","Accept-Encoding","Connection","Upgrade"];
     for (let h of dropHeaders) {
         if (reqHeaders. has(h)) {
             fp.headers[h] = reqHeaders.get(h);
         }
     }
     let randomAddress = url. searchParams. get("randomAddress");
     if(randomAddress){
         fp. headers["X-forwarded-for"] = randomAddress;
     }
     let res = await fetch("https://sydney.bing.com/sydney/ChatHub", fp);
     return new Response(res. body, res);
}
//Request an address
async function goUrl(request, url, addHeaders) {
     //Build fetch parameters
     let fp = {
         method: request. method,
         headers: {}
     }
     //keep the header information
     let reqHeaders = request. headers;
     let dropHeaders = ["accept", "accept-language","accept-encoding"];
     for (let h of dropHeaders) {
         if (reqHeaders. has(h)) {
             fp.headers[h] = reqHeaders.get(h);
         }
     }


     fp.headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.57"

     //The random address specified by the client
     let randomAddress = reqHeaders. get("randomAddress");
     if(!randomAddress){
         randomAddress = "12.24.144.227";
     }
     //Add X-forwarded-for
     fp. headers['x-forwarded-for'] = randomAddress;

     if (addHeaders) {
         //Add header information
         for (let h in addHeaders) {
             fp. headers[h] = addHeaders[h];
         }
     }


     let cookieID = 0;
     if(reqHeaders.get('NewBingGoGoWeb')){//If it is the web version
         //Add configured random cookie
         if (cookies. length === 0) {
             return getReturnError("There are no cookies available, please add cookies to the cookies variable in the first line of code");
         }
         cookieID = Math. floor(Math. random() * cookies. length);
         let userCookieID = reqHeaders. get("cookieID");
         if (userCookieID) {
             if (userCookieID >= 0 && userCookieID <= cookies. length-1) {
                 cookieID = userCookieID;
             } else {
                 return getReturnError("cookieID does not exist, please refresh the page to test!");
             }
         }
         fp.headers["cookie"] = cookies[cookieID];
     }else {//If it is a plug-in version
         fp.headers["cookie"] = reqHeaders.get('cookie');
     }

     let res = await fetch(url, fp);
     let newRes = new Response(res. body, res);
     newRes.headers.set("cookieID",`${cookieID}`);
     return newRes;
}

//Get the error message for return
function getReturnError(error) {
     return new Response(JSON. stringify({
         value: 'error',
         message: error
     }), {
         status: 200,
         statusText: 'ok',
         headers: {
             "content-type": "application/json",
             "NewBingGoGoError":'true'
         }
     })
}

// return redirection
function getRedirect(url) {
     return new Response("Redirecting to" + url, {
         status: 302,
         statusText: 'redirect',
         headers: {
             "content-type": "text/html",
             "location": url
         }
     })
}
