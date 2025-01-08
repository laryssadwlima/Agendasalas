// configuração e renderização do calendário FullCalendar

document.addEventListener('DOMContentLoaded', function () {
    function handleScroll(event) {
        // Lógica para o evento de rolagem
    }
    document.addEventListener('scroll', handleScroll, { passive: true });
    const calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {  //segundo o console aqui esta com erro
        themeSystem: 'bootstrap5',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        locale: 'pt-br',
        navLinks: true,
        selectable: true,
        selectMirror: true,
        editable: true,
        dayMaxEvents: true,
        events: (info, successCallback, failureCallback) => {
            fetch(`listar_evento.php?user_id=${document.getElementById('user_id').value}&client_id=${document.getElementById('client_id').value}`)
                .then(response => response.json())
                .then(data => successCallback(data))
                .catch(failureCallback);
        },
        eventClick: handleEventClick,
        select: handleDateSelect
    });

    function handleEventClick(info) {
        // Handle event click
    }

    function handleDateSelect(info) {
        // Handle date select
    }

    calendar.render();
});
