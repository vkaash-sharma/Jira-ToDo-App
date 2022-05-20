var uid = new ShortUniqueId();
const addbtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const allPriorityColors =  document.querySelectorAll(".priority-color");
let colors = ["lightpink","lightgreen","lightblue","black"];
let modalPriorityColor = colors[colors.length - 1];
let textAreaCont = document.querySelector(".textarea-cont");
const mainCont = document.querySelector(".main-cont");
let ticketsArr = [];
let toolBoxColors = document.querySelectorAll(".color");
let removeBtn = document.querySelector(".remove-btn");


let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";



let isModalPresent = false;
addbtn.addEventListener("click", function() {
    if(!isModalPresent){
        modalCont.style.display = "flex";
    }else{
        modalCont.style.display = "none";
    }
    isModalPresent = !isModalPresent;
});


//to remove and add active class from each priority color of modal container
allPriorityColors.forEach(function (colorElement) {
    colorElement.addEventListener("click",function () {
        allPriorityColors.forEach(function (priorityColorElem){
            priorityColorElem.classList.remove("active");
        });
       colorElement.classList.add("active");
       modalPriorityColor = colorElement.classList[0];
    });
});
//to generate and display a ticket 
modalCont.addEventListener("keydown" , function(e) {
    let key = e.key;
    if(key == "Shift"){
        console.log(modalPriorityColor);
        console.log(textAreaCont.value);
        createTicket(modalPriorityColor , textAreaCont.value);
        modalCont.style.display = "none";
        isModalPresent = false;
        textAreaCont.value = "";
        allPriorityColors.forEach(function (colorElem){
            colorElem.classList.remove("active");
        });
    }
});

//function to create new ticket
function createTicket(ticketColor , data , ticketId){
    let id = ticketId || uid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class" ,"ticket-cont");
    ticketCont.innerHTML = `
    
    <div class="ticket-color ${ticketColor} "></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${data}</div>
    <div class = "ticket-lock">
       <i class="fa-solid fa-lock"></i>
    </div>
    `;
    mainCont.appendChild(ticketCont);

    handleRemoval(ticketCont , id);
    handleColor(ticketCont , id);
    handleLock(ticketCont,id);
   
    if(!ticketId){
        ticketsArr.push(
            {
            ticketColor,
            data,
            ticketId: id
        }
    );
    localStorage.setItem("tickets",JSON.stringify(ticketsArr));
    }


};

// get all tickets from local Storage
if(localStorage.getItem("tickets")){
    ticketsArr = JSON.parse(localStorage.getItem("tickets"));
    ticketsArr.forEach(function(ticketObj){
        createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);
    })
}


//filter tickets on the basis of ticketColor
for(let i = 0 ; i <toolBoxColors.length ; i++){
    toolBoxColors[i].addEventListener("click",function(){
        let currToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter(function(ticketObj){
            if (currToolBoxColor == ticketObj.ticketColor) return ticketObj;
        });

        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i = 0 ; i< allTickets.length ; i++){
            allTickets[i].remove();
        }

        filteredTickets.forEach(function(ticketObj){
            createTicket(
                ticketObj.ticketColor,
                ticketObj.data,
                ticketObj.ticketId
            );
        })

    })

 
    toolBoxColors[i].addEventListener("dblclick",function() {
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let i = 0 ; i< allTickets.length ; i++){
            allTickets[i].remove();
        }
        ticketsArr.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);
        });

    });

}

//on clicking removeBtn, make color red and amke color white in clicking again
let removeBtnActive = false;
removeBtn.addEventListener("click" , function () {
    if(removeBtnActive){
        removeBtn.style.color = "white";
    }else{
        removeBtn.style.color = "red";
    }
    removeBtnActive = !removeBtnActive;
});
// removes ticket from local storage and UI
function handleRemoval(ticket , id){
    ticket.addEventListener("click" , function () {
        if(!removeBtnActive)return ;

        let idx = getTicketIdx(id);
        ticketsArr.splice(idx , 1);
        //removed from browser storage and set updated arr 

        localStorage.setItem("tickets" , JSON.stringify(ticketsArr));

        ticket.remove();


    });
}
//returns index of the ticket inside Local Storage's array
function getTicketIdx(id){
    let ticketIdx=ticketsArr.findIndex(function (ticketObj) {
        return ticketObj.ticketId == id;
    })
    return ticketIdx;
}

//change priority color of the tickets
function handleColor(ticket , id){
    let ticketColorStrip = ticket.querySelector(".ticket-color");

    ticketColorStrip.addEventListener("click" , function() {
        let currTicketColor = ticketColorStrip.classList[1];
        let currTicketColorIdx = colors.indexOf(currTicketColor);

        let newTicketColorIdx = currTicketColorIdx +1;
        newTicketColorIdx = newTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];

        ticketColorStrip.classList.remove(currTicketColor);
        ticketColorStrip.classList.add(newTicketColor);

        let ticketIdx = getTicketIdx(id);
        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("tickets" , JSON.stringify(ticketsArr));
    });
}
//lock and unlock to make content editable true or false 
function handleLock(ticket , id){
    let ticketLockEle = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockEle.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
     //toggle of icons and contenteditable property
     ticketLock.addEventListener("click",function() {
      let ticketIdx=getTicketIdx(id);
      if(ticketLock.classList.contains(lockClass)){
          ticketLock.classList.remove(lockClass);
          ticketLock.classList.add(unlockClass);
          ticketTaskArea.setAttribute("contenteditable","true");
      }else{
        ticketLock.classList.remove(unlockClass);
        ticketLock.classList.add(lockClass);
        ticketTaskArea.setAttribute("contenteditable", "false");
      }

      ticketTaskArea[ticketIdx].data = ticketTaskArea.innerText;
      localStorage.setItem("tikcets",JSON.stringify(ticketsArr));

     });


}