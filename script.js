function initializeFields() {
    const fromField = document.getElementById('fromField');
    const savedFrom = localStorage.getItem('fromField');
    if (savedFrom) {
        fromField.value = savedFrom;
    }

    const toField = document.getElementById('toField');
    const savedTo = localStorage.getItem('toField');
    if (savedTo) {
        toField.value = savedTo;
    }

    const dateField = document.getElementById('dateField');
    const today = new Date().toISOString().split('T')[0];
    dateField.value = today; // Установка текущей даты в поле

    const monthYearField = document.getElementById('monthYearField');
    const now = new Date();
    const monthsInGerman = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    const monthName = monthsInGerman[now.getMonth()];
    const year = now.getFullYear();
    monthYearField.value = `${monthName} ${year}`;

    const bankName = document.getElementById('bankName');
    const savedBankName = localStorage.getItem('bankName');
    if (savedBankName) {
        bankName.value = savedBankName;
    }

    const iban = document.getElementById('iban');
    const savedIban = localStorage.getItem('iban');
    if (savedIban) {
        iban.value = savedIban;
    }

    const bic = document.getElementById('bic');
    const savedBic = localStorage.getItem('bic');
    if (savedBic) {
        bic.value = savedBic;
    }

    const nameField = document.getElementById('nameField');
    const savedName = localStorage.getItem('nameField');
    if (savedName) {
        nameField.value = savedName;
    }

    const degreeField = document.getElementById('degreeField');
    const savedDegree = localStorage.getItem('degreeField');
    if (savedDegree) {
        degreeField.value = savedDegree;
    }

    const signatureImage = document.getElementById('signatureImage');
    const savedImage = localStorage.getItem('signatureImage');
    if (savedImage) {
        signatureImage.src = savedImage;
        signatureImage.style.display = 'block';
    }

    // Установка текущей даты и суммы 100 в первой группе полей
    const dateInputs = document.querySelectorAll('.dateInput');
    const sumInputs = document.querySelectorAll('.sumInput');
    dateInputs.forEach(input => {
        if (!input.value) {
            input.value = today;
        }
    });
    sumInputs.forEach(input => {
        if (!input.value) {
            input.value = 100;
        }
    });

    // Trigger PDF preview on page load
    previewPDF();
}


function addDateSum() {
    const container = document.getElementById('dateSumContainer');
    const newGroup = document.createElement('div');
    newGroup.classList.add('date-sum-group');

    // Получаем текущую дату в формате YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    newGroup.innerHTML = `
        <input type="date" class="dateInput" value="${today}" placeholder="Date">
        <input type="number" class="sumInput" value="100" placeholder="Amount" step="0.01">
    `;
    container.appendChild(newGroup);

    // Trigger PDF preview after adding new date/sum input
    previewPDF();
}


function calculateTotalSum() {
    const sumInputs = document.querySelectorAll('.sumInput');
    let total = 0;
    sumInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        total += value;
    });
    return total;
}

function handleImageUpload() {
    const imageInput = document.getElementById('imageInput');
    const signatureImage = document.getElementById('signatureImage');

    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageDataUrl = event.target.result;
            signatureImage.src = imageDataUrl;
            signatureImage.style.display = 'block';

            localStorage.setItem('signatureImage', imageDataUrl);

            // Trigger PDF preview after image upload
            previewPDF();
        };
        reader.readAsDataURL(file);
    }
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const fromField = document.getElementById('fromField');
    const toField = document.getElementById('toField');
    const cityField = document.getElementById('cityField');
    const dateField = document.getElementById('dateField');
    const monthYearField = document.getElementById('monthYearField');
    const bankNameField = document.getElementById('bankName');
    const ibanField = document.getElementById('iban');
    const bicField = document.getElementById('bic');
    const nameField = document.getElementById('nameField');
    const degreeField = document.getElementById('degreeField');
    const dateSumGroups = document.querySelectorAll('.date-sum-group');
    const totalSum = calculateTotalSum();

    localStorage.setItem('fromField', fromField.value);
    localStorage.setItem('toField', toField.value);
    localStorage.setItem('bankName', bankNameField.value);
    localStorage.setItem('iban', ibanField.value);
    localStorage.setItem('bic', bicField.value);
    localStorage.setItem('nameField', nameField.value);
    localStorage.setItem('degreeField', degreeField.value);

    const margin = 10;
    const lineHeight = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - 2 * margin;

    function calculateTextHeight(text, maxWidth) {
        const lines = doc.splitTextToSize(text, maxWidth);
        return lines.length * lineHeight;
    }

    let yPosition = margin;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`${fromField.value}`, margin, yPosition);
    yPosition += calculateTextHeight(`From: ${fromField.value}`, textWidth);// + lineHeight;

    doc.text(`An: ${toField.value}`, margin, yPosition);
    yPosition += calculateTextHeight(`To: ${toField.value}`, textWidth);// + lineHeight;

    const cityDateText = `${cityField.value}, ${dateField.value}`;
    const cityDateTextWidth = doc.getTextWidth(cityDateText);
    const xPos = pageWidth - margin - cityDateTextWidth;
    doc.text(cityDateText, xPos, yPosition);
    // yPosition += lineHeight;

    const headerText = 'HONORARNOTE';
    const headerFontSize = 16;
    doc.setFontSize(headerFontSize);
    doc.setFont('helvetica', 'bold');
    const headerWidth = doc.getTextWidth(headerText);
    const headerX = (pageWidth - headerWidth) / 2;
    yPosition += lineHeight;// * 2;
    doc.text(headerText, headerX, yPosition);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const mainContentText = `Für meine Tätigkeiten als Bratschist bei dem Wiener Kaiser Orchester stelle ich folgenden Betrag in Rechnung:`;
    yPosition += headerFontSize + lineHeight;
    const mainContentLines = doc.splitTextToSize(mainContentText, textWidth);
    mainContentLines.forEach(line => {
        doc.text(line, margin, yPosition);
        yPosition += lineHeight / 2;
    });


    doc.setFont('helvetica', 'bold');
    doc.text(`${monthYearField.value}`, margin, yPosition);
    doc.setFont('helvetica', 'normal');

    yPosition += lineHeight;

    dateSumGroups.forEach(group => {
        const date = group.querySelector('.dateInput').value;
        const amount = group.querySelector('.sumInput').value;
        if (date && amount) {
            const detailText = `${date}  —  ${amount}€`;
            const detailLines = doc.splitTextToSize(detailText, textWidth);
            detailLines.forEach(line => {
                doc.text(line, margin, yPosition);
                yPosition += lineHeight /2;
            });
        }
    });

    // yPosition += lineHeight;

    const totalSumText = `Honorar gesamt: ${totalSum.toFixed(2)} Euro`;
    const totalSumLines = doc.splitTextToSize(totalSumText, textWidth);
    doc.setFont('helvetica', 'bold');
    totalSumLines.forEach(line => {
        doc.text(line, margin, yPosition);
        yPosition += lineHeight * 1.5;
    });

    doc.setFont('helvetica', 'normal');
    const bankInfoText = `Für Sozialversicherung sowie Versteuerung bin ich selbst verantwortlich.\n\nIch bitte um Überweisung des Rechnungsbetrages auf mein Bankkonto:\n${bankNameField.value}\nIBAN: ${ibanField.value}\nBIC: ${bicField.value}`;
    const bankInfoLines = doc.splitTextToSize(bankInfoText, textWidth);
    bankInfoLines.forEach(line => {
        doc.text(line, margin, yPosition);
        yPosition += lineHeight / 2;
    });

    yPosition += lineHeight * 2;
    const closingText = `Mit freundlichen Grüßen\n${nameField.value}, ${degreeField.value}`;
    const closingLines = doc.splitTextToSize(closingText, textWidth);
    closingLines.forEach(line => {
        doc.text(line, margin, yPosition);
        yPosition += lineHeight / 2;
    });

    const signatureImage = document.getElementById('signatureImage');
        if (signatureImage.src) {
            const imgWidth = signatureImage.naturalWidth;
            const imgHeight = signatureImage.naturalHeight;
            
            // Определите максимальные размеры для изображения
            const maxWidth = 50; // максимальная ширина изображения
            const maxHeight = 20; // максимальная высота изображения

            // Вычисляем пропорции, чтобы сохранить соотношение сторон
            let newWidth = imgWidth;
            let newHeight = imgHeight;

            if (imgWidth > maxWidth || imgHeight > maxHeight) {
                const widthRatio = maxWidth / imgWidth;
                const heightRatio = maxHeight / imgHeight;
                const scaleFactor = Math.min(widthRatio, heightRatio);

                newWidth = imgWidth * scaleFactor;
                newHeight = imgHeight * scaleFactor;
            }

            // Добавляем изображение на PDF, сохраняя пропорции
            doc.addImage(signatureImage.src, 'JPEG', margin, yPosition, newWidth, newHeight);
            yPosition += newHeight + lineHeight;
        }

        return doc;
    }

function previewPDF() {
    const doc = generatePDF();
    const pdfDataUri = doc.output('datauristring');
    document.getElementById('pdfPreview').src = pdfDataUri;
}

function savePDF() {
    const doc = generatePDF();
    doc.save('userText.pdf');
}

// Initialize fields and set up event listeners
window.onload = () => {
    initializeFields();

    // Add event listeners to trigger PDF preview on input change
    document.querySelectorAll('input, textarea').forEach(element => {
        element.addEventListener('input', previewPDF);
    });

    // Add event listener to trigger PDF preview when image is uploaded
    document.getElementById('imageInput').addEventListener('change', previewPDF);
};
