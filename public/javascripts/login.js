document.getElementById('new-acc').addEventListener('click',(e)=>{
    document.getElementById('login').style.display='none';
    document.getElementById('register').style.display='flex';

})
document.getElementById('n-log').addEventListener('click',(e)=>{
    document.getElementById('register').style.display='none';
    document.getElementById('login').style.display='flex';
    
})