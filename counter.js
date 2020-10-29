const addActivityBtn = document.querySelector('.add-activity')
const activityNameInput = document.querySelector('.activity-name-input')
const playPauseBtn = document.querySelector('#play-pause-btn')
const counter = document.querySelector('.counter')
const activitiesList = document.querySelector('.activities-list')
let activeActivityBlock = document.querySelector('.activity.running')

let activities = JSON.parse(localStorage.getItem('activities')) || []
let activeActivity = {}
let state = 'paused'
let listChanged = true

setInterval(_ => {
    if (activeActivity && state != 'paused') {
        activeActivity.clock++
    }

    localStorage.setItem('activities', JSON.stringify(activities))
}, 1000)


addActivityBtn.addEventListener('click', () => {
    let activityName = activityNameInput.value
    
    if (!activityName) {
        alert('É necessário nomear a atividade')
        return
    }

    if (search(activityName, activities)) {
        alert('Não é permitido repetir nomes')
        return
    }

    activities.unshift({
        name: activityName,
        clock: 0
    })

    state = 'paused'
    activeActivity = activities[0]
    listChanged = true
    activityNameInput.value = ''

    localStorage.setItem('activities', JSON.stringify(activities))
})

playPauseBtn.addEventListener('click', () => {
    if (!activeActivity.name) {
        alert('É necessário selecionar ou adicionar uma atividade')
        activityNameInput.focus()
        return
    }

    if (state == 'running')
        state = 'paused'
    else
        state = 'running'
})

document.addEventListener('click',function(e){
    let element = e.target
    if (element && element.classList.contains('activity')) {
        activeActivity = search(element.getAttribute('data-name'), activities)
        listChanged = true
        state = 'paused'
    } 
 })

function render() {
    playPauseBtn.className = state

    if (listChanged) {
        activitiesList.innerHTML = ''

        for (a of activities) {
            console.log(a)
            let activityBlock = document.createElement('div')
            activityBlock.className = 'activity'
            activityBlock.setAttribute('data-name', a.name)

            if (activeActivity.name == a.name) {
                activityBlock.classList.add('running')
                activeActivityBlock = activityBlock
            }
            
            let activityTitle = document.createElement('div')
            activityTitle.innerHTML = a.name
            activityTitle.className = 'activity-title'

            let minutes = parseInt(a.clock / 60)
            let seconds = a.clock % 60

            let time = minutes || seconds? minutes.pad() + ':' + seconds.pad() : '00:00'

            let activityTime = document.createElement('div')
            activityTime.innerHTML = time
            activityTime.className = 'activity-time'

            activityBlock.append(activityTitle)
            activityBlock.append(activityTime)

            activitiesList.append(activityBlock)
        }

        listChanged = false
    }

    if (activeActivity.name) {
        let minutes = parseInt(activeActivity.clock / 60)
        let seconds = activeActivity.clock % 60

        let time = minutes || seconds? minutes.pad() + ':' + seconds.pad() : '00:00'

        counter.innerHTML = time
        activeActivityBlock.querySelector('.activity-time').innerHTML = time
    }
}

setInterval(_ => { render() }, 10)

Number.prototype.pad = function(size) {
    var s = String(this)
    while (s.length < (size || 2)) {s = "0" + s}
    return s
}

function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i]
        }
    }

    return undefined
}