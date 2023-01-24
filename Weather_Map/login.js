function signin(){
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    var form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);

    let params = {
        "client_id":"769024423383-k76sv210q049b33pbtlurue1diqbn5i8.apps.googleusercontent.com",
        "redirect_uri":"http://127.0.0.1:5500/Weather_Map/index.html",
        "response_type":"token",
        "scope":"https://www.googleapis.com/auth/userinfo.profile, https://www.googleapis.com/auth/userinfo.profile",
        "inclide_granted_scopes":'true',
        'state':'pass-through-value'
    }
    for(var p in params){
        let input = document.createElement('input')
        input.setAttribute('type','hidden')
        input.setAttribute('name',p)
        input.setAttribute('value',params[p])
        form.appendChild(input)
    }
    document.body.appendChild(form);
    form.submit();
}