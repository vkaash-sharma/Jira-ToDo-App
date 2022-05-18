var uid = new ShortUniqueId();
const addbtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const allPriorityColors =  document.querySelectorAll(".priority-color");
let colors = ['lightpink','lightgreen','lightblue','black'];
let modalPriorityColor = colors[colors.length - 1];
let textAreaCont = document.querySelector(".textarea-cont");
const mainCont = document.querySelector(".main-cont");
let ticketsArr = [];
let toolBoxColors = document.querySelectorAll(".color");
let removeBtn = document.querySelector(".remove-btn");


let isModalPresent = false;
addbtn.addEventListener("click", function() {
    if(!isModalPresent){
        modalCont.style.display = "flex";
    }else{
        modalCont.style.display = "none";
    }
    isModalPresent = !isModalPresent;
})



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
        // console.log(modalPriorityColor);
        // console.log(textAreaCont.value);
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

    `;
    mainCont.appendChild(ticketCont);

    handleRemoval(ticketCont , id);
    handleColor(ticketCont , id);
   
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



for(let i = 0 ; i <toolBoxColors.length ; i++){
    toolBoxColors[i].addEventListener("click",function(){
        let currToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets =ticketsArr.filter(function(ticketObj){
            return currToolBoxColor == ticketObj.ticketColor;
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

        let ticketIdx = getTicketIdx(idx);
        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("tickets" , JSON.stringify(ticketsArr));
    });
}