const currencies = {
  "USD": "United States Dollar",
  "EUR": "Euro",
  "JPY": "Japanese Yen",
  "GBP": "British Pound Sterling",
  "AUD": "Australian Dollar",
  "CAD": "Canadian Dollar",
  "CHF": "Swiss Franc",
  "CNY": "Chinese Yuan",
  "SEK": "Swedish Krona",
  "NZD": "New Zealand Dollar",
  "MXN": "Mexican Peso",
  "SGD": "Singapore Dollar",
  "HKD": "Hong Kong Dollar",
  "NOK": "Norwegian Krone",
  "KRW": "South Korean Won",
  "TRY": "Turkish Lira",
  "INR": "Indian Rupee",
  "RUB": "Russian Ruble",
  "BRL": "Brazilian Real",
  "ZAR": "South African Rand",
  "DKK": "Danish Krone",
  "PLN": "Polish Zloty",
  "TWD": "New Taiwan Dollar",
  "THB": "Thai Baht",
  "MYR": "Malaysian Ringgit",
  "IDR": "Indonesian Rupiah",
  "CZK": "Czech Koruna",
  "HUF": "Hungarian Forint",
  "ILS": "Israeli New Shekel",
  "CLP": "Chilean Peso",
  "PHP": "Philippine Peso",
  "AED": "United Arab Emirates Dirham",
  "COP": "Colombian Peso",
  "SAR": "Saudi Riyal",
  "RON": "Romanian Leu"
};

const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const amountInput = document.getElementById('amount');
const resultEl = document.getElementById('result');
const lastUpdatedEl = document.getElementById('last-updated');
const rawToggle = document.getElementById('raw-toggle');

function populateSelects() {
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';

  for (const [code, name] of Object.entries(currencies)) {
    const optionFrom = document.createElement('option');
    optionFrom.value = code;
    optionFrom.textContent = `${code} - ${name}`;

    const optionTo = document.createElement('option');
    optionTo.value = code;
    optionTo.textContent = `${code} - ${name}`;

    fromSelect.appendChild(optionFrom);
    toSelect.appendChild(optionTo);
  }

  fromSelect.value = 'USD';
  toSelect.value = 'EUR';
}

populateSelects();

async function convert() {
  const amount = parseFloat(amountInput.value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (!amount || amount <= 0) {
    alert('Enter a valid amount');
    return;
  }

  const apiKey = '3062251a47c5135d5cc4b6ca';
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.result === 'success') {
      const rate = data.conversion_rates[to];
      const converted = amount * rate;

      const formatted = converted.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      const inputFormatted = amount.toLocaleString(undefined, {
        maximumFractionDigits: 2
      });

      resultEl.textContent = `${inputFormatted} ${from} = ${formatted} ${to}`;

      if (lastUpdatedEl) {
        lastUpdatedEl.textContent = `Last updated: ${new Date().toLocaleString()}`;
      }

      showCopyButton(converted);
    } else {
      alert('Failed to get exchange rate');
    }
  } catch (e) {
    alert('Error fetching exchange rate');
  }
}

document.getElementById('convert-btn').addEventListener('click', convert);

window.addEventListener('DOMContentLoaded', () => {
  const savedMode = localStorage.getItem('colorMode');
  if (savedMode === 'dark') {
    document.body.classList.add('dark');
  }
});

document.getElementById('mode-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('colorMode', isDark ? 'dark' : 'light');
});

let copyBtn;

function showCopyButton(convertedValue) {
  if (!copyBtn) {
    copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy Result';
    copyBtn.style.marginTop = '12px';
    copyBtn.style.padding = '8px 16px';
    copyBtn.style.fontSize = '14px';
    copyBtn.style.borderRadius = '8px';
    copyBtn.style.border = 'none';
    copyBtn.style.backgroundColor = 'var(--button-bg-light)';
    copyBtn.style.color = 'white';
    copyBtn.style.cursor = 'pointer';
    copyBtn.style.transition = 'background 0.2s ease';

    copyBtn.addEventListener('mouseenter', () => {
      copyBtn.style.backgroundColor = 'var(--button-hover-light)';
    });

    copyBtn.addEventListener('mouseleave', () => {
      copyBtn.style.backgroundColor = 'var(--button-bg-light)';
    });

    copyBtn.addEventListener('click', () => {
      if (resultEl.textContent) {
        let valueToCopy;
        if (rawToggle && rawToggle.checked) {
          valueToCopy = convertedValue.toFixed(2); // raw (just decimal, no commas)
        } else {
          valueToCopy = convertedValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        }

        navigator.clipboard.writeText(valueToCopy)
          .then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => (copyBtn.textContent = 'Copy Result'), 1500);
          })
          .catch(() => alert('Failed to copy'));
      }
    });

    resultEl.after(copyBtn);
  }
  copyBtn.style.display = 'inline-block';
}

// 🔁 Reverse button setup
const reverseBtn = document.createElement('button');
reverseBtn.textContent = '⇄ Reverse';
reverseBtn.style.margin = '10px 0';
reverseBtn.style.padding = '8px 12px';
reverseBtn.style.fontSize = '14px';
reverseBtn.style.borderRadius = '8px';
reverseBtn.style.border = 'none';
reverseBtn.style.backgroundColor = 'var(--button-bg-light)';
reverseBtn.style.color = 'white';
reverseBtn.style.cursor = 'pointer';
reverseBtn.style.transition = 'background 0.2s ease';

reverseBtn.addEventListener('mouseenter', () => {
  reverseBtn.style.backgroundColor = 'var(--button-hover-light)';
});
reverseBtn.addEventListener('mouseleave', () => {
  reverseBtn.style.backgroundColor = 'var(--button-bg-light)';
});

reverseBtn.addEventListener('click', () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
});

toSelect.after(reverseBtn);
