$(function(){
  var current_url;

  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    current_url = (tabs[0].url);
    alert(current_url);
    var fd = new FormData();

    JSON.stringify(current_url);
    fd.append('faddress', current_url);
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/audicle_data",
      data: fd,
      crossDomain: true,
      processData: false,
      contentType: false,
    }).done(function(data){
        alert(data)
    });
  });
});
