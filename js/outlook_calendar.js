function formatDateForICS(dateStr) {
    // Recebe a data no formato DD/MM/YYYY HH:mm
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes] = timePart.split(':');

    // Retorna no formato YYYYMMDDTHHMMSS
    return `${year}${month}${day}T${hours}${minutes}00`;
}

function addToOutlook() {
    // Pegar os valores exatos dos elementos
    const title = document.getElementById('visualizar_title').textContent;
    const start = document.getElementById('visualizar_start').textContent; // DD/MM/YYYY HH:mm
    const end = document.getElementById('visualizar_end').textContent;     // DD/MM/YYYY HH:mm
    const location = document.getElementById('visualizar_name').textContent;
    const description = document.getElementById('visualizar_obs').textContent;

    // Log para debug
    console.log('Dados originais do evento:', {
        title: title,
        start: start,
        end: end,
        location: location,
        description: description
    });

    // Formatar as datas para o formato ICS
    const startFormatted = formatDateForICS(start);
    const endFormatted = formatDateForICS(end);

    // Log das datas formatadas
    console.log('Datas formatadas:', {
        startOriginal: start,
        endOriginal: end,
        startFormatted: startFormatted,
        endFormatted: endFormatted
    });

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Fibrafort//Agenda//PT
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${startFormatted}
DTEND:${endFormatted}
LOCATION:${location}
DESCRIPTION:${description}
UID:${Date.now()}@fibrafort.com
SEQUENCE:0
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    // Log do conteúdo final do arquivo ICS
    console.log('Conteúdo do arquivo ICS:', icsContent);

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'evento_fibrafort.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Mantendo a função addNewToOutlook() como está, pois está funcionando corretamente
function addNewToOutlook() {
    const title = document.getElementById('cad_title').value;
    const start = document.getElementById('cad_start').value;
    const end = document.getElementById('cad_end').value;
    const location = document.getElementById('cad_user_id').options[document.getElementById('cad_user_id').selectedIndex].text;
    const description = document.getElementById('cad_obs').value;

    if (!title || !start || !end || !location) {
        alert('Por favor, preencha todos os campos necessários antes de adicionar ao Outlook.');
        return;
    }

    // Converter as datas do formato ISO para ICS
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startFormatted = startDate.getFullYear() +
        String(startDate.getMonth() + 1).padStart(2, '0') +
        String(startDate.getDate()).padStart(2, '0') + 'T' +
        String(startDate.getHours()).padStart(2, '0') +
        String(startDate.getMinutes()).padStart(2, '0') + '00';

    const endFormatted = endDate.getFullYear() +
        String(endDate.getMonth() + 1).padStart(2, '0') +
        String(endDate.getDate()).padStart(2, '0') + 'T' +
        String(endDate.getHours()).padStart(2, '0') +
        String(endDate.getMinutes()).padStart(2, '0') + '00';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Fibrafort//Agenda//PT
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${startFormatted}
DTEND:${endFormatted}
LOCATION:${location}
DESCRIPTION:${description}
UID:${Date.now()}@fibrafort.com
SEQUENCE:0
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'evento_fibrafort.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}