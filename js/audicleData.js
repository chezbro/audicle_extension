$(function() {
  $('#test_url').click(function(){
  var current_url;
  var url_address;
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    current_url = (tabs[0].url);
    $("#test_url").text(current_url)
   });
});
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/audicle_data",
    async: false,
    dataType: "json",
    data: {web_address: $(this).find("#test_url").text()}
  })
    .done(function(data){
      alert(data)
    });

  })
