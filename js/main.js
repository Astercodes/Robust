document.querySelectorAll('nav.links a').forEach(function(link){
  link.addEventListener('click', function(){
    var toggle = document.getElementById('menu-toggle');
    if (toggle) toggle.checked = false;
  });
});
