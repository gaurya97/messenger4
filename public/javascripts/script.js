

let reciverid;


// const formateddate = currentdate.toLocaleDateString('en-IN',dateoption);
// const formateddate = currentdate.toLocaleString('en-IN',dateoption).replace(/,/g,'');
// const formatedtime = currentdate.toLocaleTimeString('en-IN',timeoption);
// console.log(formateddate)

// const year= String(date.getFullYear())
// const month= String(date.getMonth()+1);
//   const day= String(date.getDate()).padStart(2,'0');
// const hr = String(date.getHours()).padStart(2,'0');
// const min = String(date.getMinutes()).padStart(2,'0');
// const sec = String(date.getSeconds()).padStart(2,'0');

const socket =io();
let contact_name = document.querySelector(".contact_name h5");
let stat =document.querySelector(".contact_name small");
let userid =document.getElementById('username').value
console.log(userid)
socket.on('updateid',(e)=>{
  document.getElementById('socket').value=e;
  console.log(document.getElementById('socket').value)
  socket.emit('newuserid',{
    userid:userid,
    socketid:e
  })
})

socket.on('onlineuser',(e)=>{
  if(document.getElementById(`${e}`)){
    document.getElementById(`${e}`).value='online';
    if(contact_name.innerHTML===e){
      stat.innerHTML='online';
    }

  }

  
})

socket.on('offlineuser',(e)=>{
  console.log(e)
  let currentdate =new Date()
const dateoption ={
 weekday:'short',
 year:'numeric',
 month:'short',
 day:'numeric',
 hour:'numeric',
  minute:'numeric',
  second:'numeric',
  hour12:true
}
  const formateddate = currentdate.toLocaleString('en-IN',dateoption).replace(/,/g,'');
  document.getElementById(`${e}`).value=`Last seen at ${formateddate}`;
 
  if(contact_name.innerHTML===e){
    stat.innerHTML=`Last seen at ${formateddate}`;
  }
})
// socket.emit('newuserid',userid)



const eventsourse =new EventSource('/userlogupdate');
eventsourse.onmessage =function (event){
    console.log(event);
        window.location.href ="/profile";
    
}

let load_msg =(id)=>{
  let chat_ele =document.getElementById('chat');
  while(chat_ele.firstChild){
    chat_ele.removeChild(chat_ele.firstChild);
  }

  let data ={
    sendid:userid,
    reciverid:id
  }
  fetch('/loadmesseges',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(data)
    
  })
  .then(res=>res.json())
  .then(e=>{
    console.log(e)
    e.msg.forEach((e)=>{
      if(e.sender===userid){
           sendMessege(e.msg,e.time)
      }
      else if(e.sender===userid && e.reciverid ===userid){
        sendMessege(e.msg,e.time)
      }
      else{
        reciveMessege(e.msg,e.time)
      }
    })
      
    socket.emit('msgstatus',{
      sendid:userid,
      reciverid:id
    })
  })
  .catch(err=>{
    console.error('Error',err);
  })

}




socket.on('newuserid1',(e)=>{
  console.log(e.usersocketid,e.userid)


  document.getElementById(`${e.userid}`).value=e.usersocketid;
  // console.log(document.getElementById(`${e.userid}`))
  // let usercon=document.getElementById('usercon')
  // let li =document.createElement('li');
  // let hidden_input =document.createElement('input');
  //   hidden_input.setAttribute('type','hidden');
  //   hidden_input.setAttribute('id',`${e.userid}`);
  //   hidden_input.setAttribute('value',`${e.usersocketid}`);
  // let profile_section =document.createElement('div')
  // profile_section.classList.add('profile_section')
  // let img =document.createElement('img')
  // img.setAttribute('src','icons/img2.png')
  // profile_section.appendChild(img);
  // let h5=document.createElement('h5')
  // h5.innerText = `${e.userid}`
  // let contact_section =document.createElement('div')
  // contact_section.classList.add('contact_section')
  // contact_section.appendChild(h5)
  // li.appendChild(hidden_input)
  // li.appendChild(profile_section)
  // li.appendChild(contact_section)
  // usercon.appendChild(li)
 })

let socketid = document.getElementById('socket')
console.log(socketid)
let send = document.getElementById('send')


let btns = document.querySelectorAll(".bottom_header_content button");
let status_area = document.querySelector(".status_area");
let calls_area = document.querySelector(".call_area");
let contact_list = document.querySelector(".contact_list");
let community_area = document.querySelector(".community_area");
let chatBtns = document.querySelector(".chatBtns");
// let status_btns = document.querySelector(".status_btns");
let callBtns = document.querySelector(".callBtns");
let profile_Section_chat = document.querySelector(".profile_Section_chat");
let chat_contact_area = document.querySelector(".chat_contact_area");
let userContactList = document.querySelectorAll('.userContactList li');
let userpeopleList = document.querySelectorAll('.userpeopleList li');
let contact_chat_area = document.querySelector('.contact_chat_area');
let profile_contact = document.querySelector(".profile_contact");
let profile_contact_img = document.querySelector(".profile_contact img");


btns.forEach((element) => {
  element.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    if (element.id === "status") {
      status_area.style.left = "0";
      contact_list.style.left = "-100%";
      calls_area.style.left = "100%";
      community_area.style.left = "-100%";
      element.classList.add("active");
      // chatBtns.style.display = "none";
      // status_btns.style.display = "block";
      callBtns.style.display = "none";
    } else if (element.id === "chats") {
      status_area.style.left = "100%";
      contact_list.style.left = "0%";
      calls_area.style.left = "100%";
      community_area.style.left = "-100%";
      element.classList.add("active");
      // chatBtns.style.display = "block";
      // status_btns.style.display = "none";
      callBtns.style.display = "none";
    } else if (element.id === "calls") {
      calls_area.style.left = "0";
      status_area.style.left = "-100%";
      contact_list.style.left = "-100%";
      community_area.style.left = "-100%";
      element.classList.add("active");
      // chatBtns.style.display = "none";
      // status_btns.style.display = "none";
      callBtns.style.display = "block";
    } else {
      calls_area.style.left = "100%";
      status_area.style.left = "100%";
      contact_list.style.left = "100%";
      community_area.style.left = "0";
      element.classList.add("active");
      // chatBtns.style.display = "none";
      // status_btns.style.display = "none";
      callBtns.style.display = "none";
    }
  });
});

userContactList.forEach((element, index) =>{
  element.setAttribute('id', `contact_btn${index}`);
  element.addEventListener('click', () =>{
    if(element.id === `contact_btn${index}`){
      contact_chat_area.style.display ="block";
      contact_chat_area.style.zIndex='1';
    }
    // profile_contact_img.src = element.firstElementChild.childNodes[2].src;
    contact_name.innerHTML = element.children[2].firstElementChild.innerHTML;
    stat.innerHTML=element.children[0].value;
    console.log(element.children[0].value)
    reciverid =element.children[2].firstElementChild.innerHTML;
    load_msg(reciverid);
    document.getElementById('cl').style.display='none';

    document.getElementById('chats').style.display='none';
    document.getElementById('status').style.display='none';
    
  })
});

const typing_color=(receverid,color)=>{
  document.getElementById(`ls_${receverid}`).style.color=`${color}`;
}

profile_contact.addEventListener('click', () =>{
  socket.emit('msgstatus',{
    sendid:userid,
    reciverid:reciverid
  })
  loadLastmsg('gray');

  contact_chat_area.style.display ="none";
  document.getElementById('cl').style.display='block';
  
    document.getElementById('chats').style.display='block';
    document.getElementById('status').style.display='block';
    document.getElementById('calls').style.display='block';
})


//messege communication



let sendMessege=(sentmsg,time)=>{
  let p=document.createElement('p');
  p.classList.add('right_chat');
  // p.innerText =sentmsg;
  p.innerHTML = `${sentmsg} <small style="font-size: 12px; color: gray;">${time}</small>` ;
  document.getElementById('chat').appendChild(p);
  
 
}
let reciveMessege=(messege,time)=>{
  let p=document.createElement('p');
  p.classList.add('left_chat');
  // p.innerText =messege;
  p.innerHTML = `${messege} <small style="font-size: 12px; color: gray;">${time}</small>` ;
  document.getElementById('chat').appendChild(p);
}

//load last msg and count
let loadLastmsg =()=>{
  Array.from(document.getElementsByClassName('count')).forEach((e)=>{
    console.log('wedgahdshag',e.id)
    document.getElementById(`${e.id}`).style.display ='none'
  })
  socket.emit('getlastmsg',{sender:document.getElementById('username').value,
  recever:reciverid})
  socket.emit('getcount',{sender:document.getElementById('username').value,
  recever:reciverid});
  socket.on('setlastmsg',(e)=>{
    console.log(e)
    e.forEach((e)=>{
      let lastid
      if(e.sender === userid){
       lastid =e.recever
      }
      else{
        lastid=e.sender
      }
      console.log(lastid)
      document.getElementById(`ls_${lastid}`).style.color=`${color}`
      document.getElementById(`ls_${lastid}`).innerText=e.msg
      document.getElementById(`ts_${lastid}`).innerText=e.time
    })
  })
 
   
  socket.on('setcount',(e)=>{
    console.log(e)
   if(e.length>0){
    e.forEach((e)=>{
      console.log(e)
      if(e.sender != userid){
        document.getElementById(`tc_${e.sender}`).style.display='block'
        document.getElementById(`tc_${e.sender}`).innerText=e.count
      }
      
    })
    
   }
   
  
  })

}








send.addEventListener('click',(e)=>{
  let now =new Date();
  let mytime =now.toLocaleTimeString('en-IN',{hour12:true, hour:'numeric',minute:'2-digit'});
  console.log(mytime)
  sendMessege(document.getElementById('msg-input').value,mytime);

  console.log(document.getElementById(`${reciverid}`).value);
socket.emit('sendMessege',{
  sendersocketid:document.getElementById('socket').value,
  senderid:userid,
  recceiverid:reciverid,
  msg:document.getElementById('msg-input').value,
  time:mytime
}

)
document.getElementById('msg-input').value='';

})

socket.on('reccivemessage',(e)=>{
 
reciveMessege(e.msg,e.time)
loadLastmsg('gray');
})

document.getElementById('msg-input').addEventListener('input',(e)=>{
  socket.emit('typestat',{reciverid:reciverid,senderid:userid})
})
document.getElementById('msg-input').addEventListener('blur',(e)=>{
  socket.emit('typestat1',{reciverid:reciverid,senderid:userid})
})

socket.on('typpingstat',(e)=>{
  document.getElementById(`${e}`).value='typing...';
  typing_color(e,'green')
  document.getElementById(`ls_${e}`).innerText='typing...'

  console.log()
  if(contact_name.innerHTML===e){
    stat.innerHTML='typing...';
  }
})
socket.on('typpingstat1',(e)=>{
  document.getElementById(`${e}`).value='online';
  loadLastmsg('gray');
  if(contact_name.innerHTML===e){
    stat.innerHTML='online';
  }
})



document.addEventListener('DOMContentLoaded',(e)=>{
   loadLastmsg('gray')
})



