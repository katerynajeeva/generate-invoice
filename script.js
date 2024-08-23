function initializeFields() {
    const fromName = document.getElementById('fromName');
    const savedFromName = localStorage.getItem('fromName');
    if (savedFromName) {
        fromName.value = savedFromName;
    }

    const fromAddress = document.getElementById('fromAddress');
    const savedFromAddress = localStorage.getItem('fromAddress');
    if (savedFromAddress) {
        fromAddress.value = savedFromAddress;
    }

    const toName = document.getElementById('toName');
    const savedToName = localStorage.getItem('toName');
    if (savedToName) {
        toName.value = savedToName;
    }

    const toAddress = document.getElementById('toAddress');
    const savedToAddress = localStorage.getItem('toAddress');
    if (savedToAddress) {
        toAddress.value = savedToAddress;
    }

    const dateField = document.getElementById('dateField');
    const today = new Date().toISOString().split('T')[0];
    dateField.value = today;

    const now = new Date();
    const monthsInGerman = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    const monthName = monthsInGerman[now.getMonth()];
    const year = now.getFullYear();

    const mainContentField = document.getElementById('mainContentField');
    mainContentField.value = `Für meine Tätigkeiten als Bratschist bei dem ${toName.value} stelle ich folgenden Betrag für den Monat: ${monthName} ${year} in Rechnung:`;
    
    const dateInput = document.getElementById('dateInput');
    dateInput.value = today;

    const sumInput = document.getElementById('sumInput');
    sumInput.value = "200";

    const insuranceTextField = document.getElementById('insuranceTextField');
    insuranceTextField.value = `Für Sozialversicherung sowie Versteuerung bin ich selbst verantwortlich.`;

    const bankTextField = document.getElementById('bankTextField');
    bankTextField.value = `Ich bitte um Überweisung des Rechnungsbetrages auf mein Bankkonto:`;


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

    const fromAcademicDegree = document.getElementById('fromAcademicDegree');
    const savedAcademicDegree = localStorage.getItem('fromAcademicDegree');
    if (savedAcademicDegree) {
        fromAcademicDegree.value = savedAcademicDegree;
    }

    const signatureImage = document.getElementById('signatureImage');
    const savedImage = localStorage.getItem('signatureImage');
    if (savedImage) {
        signatureImage.src = savedImage;
        signatureImage.style.display = 'block';
    }

    // Trigger PDF preview on page load
    previewPDF();
}

function changeNameInMainContentText (newName) {
    const previousName = localStorage.getItem('toName');
    console.log(`previousName: ${previousName}, newName: ${newName}`); 
    const mainContentField = document.getElementById('mainContentField');
    const mainContentFieldText = mainContentField.value;
    mainContentField.value = mainContentFieldText.replace(previousName, newName);
}

function addDateSum() {
    const container = document.getElementById('dateSumContainer');
    const newGroup = document.createElement('div');
    newGroup.classList.add('date-sum-group');

    // Получаем текущую дату в формате YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const sumInput = document.getElementById('sumInput');

    newGroup.innerHTML = `
        <input type="date" class="dateInput" value="${today}" placeholder="Date">
        <input type="number" class="sumInput" value="${sumInput.value}" placeholder="Fee" step="5">
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

    const fromName = document.getElementById('fromName');
    const fromAddress = document.getElementById('fromAddress');
    const toName = document.getElementById('toName');
    const toAddress = document.getElementById('toAddress');
    const cityField = document.getElementById('cityField');
    const dateField = document.getElementById('dateField');
    const bankNameField = document.getElementById('bankName');
    const ibanField = document.getElementById('iban');
    const bicField = document.getElementById('bic');
    const savedAcademicDegree = document.getElementById('fromAcademicDegree');
    const dateSumGroups = document.querySelectorAll('.date-sum-group');
    const totalSum = calculateTotalSum();

    localStorage.setItem('fromName', fromName.value);
    localStorage.setItem('fromAddress', fromAddress.value);
    localStorage.setItem('toName', toName.value);
    localStorage.setItem('toAddress', toAddress.value);
    localStorage.setItem('bankName', bankNameField.value);
    localStorage.setItem('iban', ibanField.value);
    localStorage.setItem('bic', bicField.value);
    localStorage.setItem('fromAcademicDegree', fromAcademicDegree.value);

    const margin = 25;
    const lineHeight = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = pageWidth - 2 * margin;

    // Function to calculate text height based on content
    function calculateTextHeight(text) {
        const textLines = doc.splitTextToSize(text, pageWidth - 2 * margin);
        return textLines.length * lineHeight;
    }

    let yPosition = margin;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`${fromName.value}, ${fromAcademicDegree.value}`, margin, yPosition);
    yPosition += lineHeight / 2;
    doc.text(`${fromAddress.value}`, margin, yPosition);
    yPosition += calculateTextHeight(fromAddress.value, textWidth);

    doc.text(`An: ${toName.value}`, margin, yPosition);
    yPosition += lineHeight / 2;
    doc.text(`${toAddress.value}`, margin, yPosition);
    yPosition += calculateTextHeight(toAddress.value, textWidth);

    const cityDateText = `${cityField.value}, ${dateField.value}`;
    const cityDateTextWidth = doc.getTextWidth(cityDateText);
    const xPos = pageWidth - margin - cityDateTextWidth;
    doc.text(cityDateText, xPos, yPosition);

    const headerText = 'HONORARNOTE';
    const headerFontSize = 16;
    doc.setFontSize(headerFontSize);
    doc.setFont('helvetica', 'bold');
    const headerWidth = doc.getTextWidth(headerText);
    const headerX = (pageWidth - headerWidth) / 2;
    yPosition += lineHeight;
    doc.text(headerText, headerX, yPosition);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const mainContentText = mainContentField.value;
    yPosition += headerFontSize + lineHeight;
    const mainContentLines = doc.splitTextToSize(mainContentText, textWidth);
    mainContentLines.forEach(line => {
        doc.text(line, margin, yPosition);
        yPosition += lineHeight / 2;
    });
    yPosition += lineHeight / 2;

    dateSumGroups.forEach(group => {
        const date = group.querySelector('.dateInput').value;
        const amount = group.querySelector('.sumInput').value;
        if (date && amount) {
            const detailText = `${date}  —  ${amount}€`;
            const detailLines = doc.splitTextToSize(detailText, textWidth);
            detailLines.forEach(line => {
                doc.text(line, margin, yPosition);
                yPosition += lineHeight / 2;
            });
        }
    });

    const totalSumText = `Honorar gesamt: ${totalSum.toFixed(2)} Euro`;
    doc.setFont('helvetica', 'bold');
    doc.text(totalSumText, margin, yPosition);
    yPosition += lineHeight * 1.5;

    doc.setFont('helvetica', 'normal');
    const insuranceText = insuranceTextField.value;
    doc.text(insuranceText, margin, yPosition);
    yPosition += lineHeight;

    doc.setFont('helvetica', 'bold');
    const bankInfoText = bankTextField.value;
    doc.text(bankInfoText, margin, yPosition);
    yPosition += lineHeight / 2;

    doc.setFont('helvetica', 'normal');
    doc.text(fromName.value, margin, yPosition);
    yPosition += lineHeight / 2;
    doc.text(`Bank Name: ${bankNameField.value}`, margin, yPosition);
    yPosition += lineHeight / 2;
    doc.text(`IBAN: ${ibanField.value}`, margin, yPosition);
    yPosition += lineHeight / 2;
    doc.text(`BIC: ${bicField.value}`, margin, yPosition);

    yPosition += lineHeight * 2;
    const closingText = `Mit freundlichen Grüßen\n${fromName.value}, ${fromAcademicDegree.value}`;
    const closingLines = doc.splitTextToSize(closingText, textWidth);
    closingLines.forEach(line => {
        doc.text(line, margin, yPosition);
        yPosition += lineHeight / 2;
    });

    const signatureImage = document.getElementById('signatureImage');
    if (signatureImage.src) {
        const imgWidth = signatureImage.naturalWidth;
        const imgHeight = signatureImage.naturalHeight;
        
        const maxWidth = 50;
        const maxHeight = 20;

        let newWidth = imgWidth;
        let newHeight = imgHeight;

        if (imgWidth > maxWidth || imgHeight > maxHeight) {
            const widthRatio = maxWidth / imgWidth;
            const heightRatio = maxHeight / imgHeight;
            const scaleFactor = Math.min(widthRatio, heightRatio);

            newWidth = imgWidth * scaleFactor;
            newHeight = imgHeight * scaleFactor;
        }

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

function savePDF(fromName, toName) {
    const doc = generatePDF();
    const today = new Date().toISOString().split('T')[0];
    const editedFromName = fromName.replace(/ /g, "-")
    const editedToName = toName.replace(/ /g, "-")
    doc.save(`honorarnote-${today}-${editedFromName}-${editedToName}.pdf`);
}

// Initialize fields and set up event listeners
window.onload = () => {
    initializeFields();

    document.querySelectorAll('input#toName').forEach(element => {
        element.addEventListener('input', (event) => {
                const newName = event.target.value;
                changeNameInMainContentText(newName);
            });
    });

    document.querySelectorAll('input, textarea').forEach(element => {
        element.addEventListener('input', previewPDF);
    });

    document.querySelectorAll('select').forEach(element => {
        element.addEventListener('change', previewPDF);
    });

    document.getElementById('imageInput').addEventListener('change', handleImageUpload);
};