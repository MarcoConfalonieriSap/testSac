(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <!DOCTYPE html>
    <html lang="it">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Analyzer</title>
        <style>
        
        :host {
            display: block;
            width: 100%;
            height: 100%;
            border: 1px solid #ccc;
            font-family: Arial, sans-serif;
            box-sizing: border-box;
        }

        .chat-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .chat-bubble {
            max-width: 75%;
            padding: 10px 12px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
        }

        .chat-bubble.user {
            align-self: flex-end;
            background: #d1e7ff;
            border-bottom-right-radius: 2px;
        }

        .chat-bubble.assistant {
            align-self: flex-start;
            background: #eaeaea;
            border-bottom-left-radius: 2px;
        }

        .chat-bubble h1, .chat-bubble h2, .chat-bubble h3 {
            margin: 8px 0 4px 0;
            line-height: 1.3;
        }
        .chat-bubble h1 { font-size: 1.3em; }
        .chat-bubble h2 { font-size: 1.15em; }
        .chat-bubble h3 { font-size: 1.05em; }
        
        .chat-bubble code {
            background: #f0f0f0;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: monospace;
            font-size: 0.9em;
        }
        
        .chat-bubble pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 10px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 8px 0;
        }
        
        .chat-bubble pre code {
            background: transparent;
            color: inherit;
            padding: 0;
        }
        
        .chat-bubble ul, .chat-bubble ol {
            margin: 6px 0;
            padding-left: 20px;
        }
        
        .chat-bubble li {
            margin: 3px 0;
        }
        
        .chat-bubble a {
            color: #0066cc;
            text-decoration: underline;
        }
        
        .chat-bubble p {
            margin: 6px 0;
        }
        
        .chat-bubble hr {
            border: none;
            border-top: 1px solid #ccc;
            margin: 10px 0;
        }
        
        .chat-bubble strong {
            font-weight: bold;
        }
        
        .chat-bubble em {
            font-style: italic;
        }

        .message-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .message-row.assistant {
            align-self: flex-start;
        }

        .speaker-button {
            width: 24px;
            height: 24px;
            background: url('https://cdn-icons-png.flaticon.com/512/727/727269.png') center/contain no-repeat;
            border: none;
            cursor: pointer;
            flex-shrink: 0;
            opacity: 0.6;
            transition: opacity 0.2s;
        }

        .speaker-button:hover {
            opacity: 1;
        }

        .speaker-button.playing {
            opacity: 1;
            background-color: #ffcccc;
            border-radius: 50%;
        }

        .copy-button {
            width: 24px;
            height: 24px;
            background: url('https://cdn-icons-png.flaticon.com/512/1621/1621635.png') center/contain no-repeat;
            border: none;
            cursor: pointer;
            flex-shrink: 0;
            opacity: 0.6;
            transition: opacity 0.2s;
        }

        .copy-button:hover {
            opacity: 1;
        }

        .copy-button.copied {
            opacity: 1;
            background-color: #ccffcc;
            border-radius: 50%;
        }

        #AllContent {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
        }

        #generatedAnalysis {
            flex: 1;               /* Occupa tutto lo spazio rimasto */
            overflow-y: auto;      /* Scroll verticale */
            padding: 8px;
            user-select: text;
            background: #f9f9f9;
            width: 100%;
            box-sizing: border-box;
        }

        #inputBar {
            display: flex;
            align-items: center;
            border-top: 1px solid #ccc;
            padding: 6px;
            background: #fff;
            width: 100%;
            box-sizing: border-box;
        }

        #userInput {
            flex: 1;
            padding: 6px;
            font-size: 14px;
            margin-right: 8px;
        }

        #micButton {
            width: 32px;
            height: 32px;
            background: url('https://cdn-icons-png.flaticon.com/512/1082/1082810.png') center/contain no-repeat;
            border: none;
            cursor: pointer;
        }

        #playButton {
            width: 32px;
            height: 32px;
            background: url('https://cdn-icons-png.flaticon.com/512/727/727245.png') center/contain no-repeat;
            border: none;
            cursor: pointer;
            margin-left: 8px; /* Spazio tra i bottoni */
        }

        </style>
    </head>
    <body>
        <div id="AllContent">
            <div id="generatedAnalysis" class="chat-container"></div>
            <div id="inputBar">
                <input id="userInput" type="text" placeholder="Scrivi qui..." />
                <button id="micButton" title="Avvia riconoscimento vocale"></button>
                <button id="playButton" title="Avvia llm"></button>
            </div>
        </div>
    </body>
    `;

    // WeakMap privata per memorizzare dati sensibili in modo sicuro
    const privateData = new WeakMap();

    customElements.define('com-sap-sac-aianalyzer', class CustomWidget extends HTMLElement {

        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this._firstConnection = false;

            this._props = {};
            this._accessToken = "";

            // Inizializza WeakMap per dati sensibili
            privateData.set(this, {
                clientSecret: '',
                clientId: ''
            });

            this.userInput = this._shadowRoot.getElementById('userInput');
            this.micButton = this._shadowRoot.getElementById('micButton');
            this.playButton = this._shadowRoot.getElementById('playButton');
            this.generatedAnalysis = this._shadowRoot.getElementById('generatedAnalysis');

            this.languageSelection = 'it-IT' //change to English 'en-US'
            this.speechRate = 1.0 // Velocità della voce
            this.speechPitch = 0.9 // Altezza della voce
            this.speechVolume = 0.8 // Volume della voce
            this.selectedVoice = null // Voce selezionata per TTS

            this._isListening = false
            this.addSpeechToText() // Add microphone support
            this.initializeVoice() // Inizializza la voce per TTS

            this.inizializeVariable();

            this.addChatMessage(
                'Benvenuto nel widget di analisi personalizzato SAC. Scrivi qualcosa o usa il microfono.',
                'assistant'
            );

            this.playButton.addEventListener('click', async () => {
                    await this._handleLlm();
            })

            //attiva chat con invio da tastiera
            this.userInput.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    await this._handleLlm();
                }
            });

        }

        inizializeVariable() {
            this.sapAiToken = ''; //valorizzato da codice
            this.apiVersion = ''; //boh

            this._serviceUrl = "";
            this._authUrl = "";
            this._tipologiaChat = "Singolo Messaggio";
            this._systemMessage = "";
            this._userMessage = "";
            this._llmProperties = {};
            
            this._dataJson = null;

        }

        async _handleLlm() {
            console.log("Calling LLM for suggestions...");

            const actualUserInput = this.userInput.value;

            this.clearChatMessage(this._tipologiaChat);

            this.addChatMessage(actualUserInput, 'user');
            this.userInput.value = ''; // Clear input field

            await this.getToken();

            const llmResponse = await this.callLLMForSuggestions(actualUserInput);

            this.addChatMessage(llmResponse, 'assistant');
        }
		onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			if ("serviceUrl" in changedProperties) {
				//console.log("Service URL changed to: ", changedProperties["serviceUrl"]);
                this._serviceUrl = changedProperties["serviceUrl"];
			}
			if ("clientId" in changedProperties) {
				//console.log("Client ID changed to: ", changedProperties["clientId"]);
                const secrets = privateData.get(this);
                secrets.clientId = changedProperties["clientId"];
			}
			if ("clientSecret" in changedProperties) {
				//console.log("Client Secret changed to: ", changedProperties["clientSecret"]);
                const secrets = privateData.get(this);
                secrets.clientSecret = changedProperties["clientSecret"];
			}
			if ("authUrl" in changedProperties) {
				//console.log("Auth URL changed to: ", changedProperties["authUrl"]);
                this._authUrl = changedProperties["authUrl"];
			}
            if ("tipologiaChat" in changedProperties) {
                //console.log("Single Message changed to: ", changedProperties["tipologiaChat"]);
                this._tipologiaChat = changedProperties["tipologiaChat"];
                this.updateInputState();
            }
            if ("systemMessage" in changedProperties) {
                //console.log("System Message changed to: ", changedProperties["systemMessage"]);
                this._systemMessage = changedProperties["systemMessage"];
            }
            if ("userMessage" in changedProperties) {
                //console.log("User Message changed to: ", changedProperties["userMessage"]);
                this._userMessage = changedProperties["userMessage"];
            }
            if ("llmProperties" in changedProperties) {
                //console.log("Llm Properties changed to: ", changedProperties["llmProperties"]);
                this._llmProperties = changedProperties["llmProperties"];
            }

            this.getDataSource();
		}

        updateInputState() {
            if (this._tipologiaChat === 'bloccato') {
                this.userInput.disabled = true;
                this.userInput.placeholder = this._userMessage;
                this.micButton.disabled = true;
            } else {
                this.userInput.disabled = false;
                this.userInput.placeholder = 'Scrivi qui...';
                this.micButton.disabled = false;
            }
        }

        initializeVoice() {
            const setVoice = () => {
                const voices = window.speechSynthesis.getVoices();
                const lang = this.languageSelection.split('-')[0]; // 'it' da 'it-IT'
                
                // Cerca voci in ordine di preferenza: Google, Premium, Natural, poi qualsiasi voce della lingua
                this.selectedVoice = voices.find(voice => 
                    voice.lang.startsWith(lang) && voice.name.includes('Google')
                ) || voices.find(voice => 
                    voice.lang.startsWith(lang) && (voice.name.includes('Premium') || voice.name.includes('Enhanced'))
                ) || voices.find(voice => 
                    voice.lang.startsWith(lang) && voice.name.includes('Natural')
                ) || voices.find(voice => 
                    voice.lang.startsWith(lang)
                );
                
                if (this.selectedVoice) {
                    console.log('Voce selezionata:', this.selectedVoice.name);
                }
            };
            
            // Le voci potrebbero non essere immediatamente disponibili
            if (window.speechSynthesis.getVoices().length > 0) {
                setVoice();
            } else {
                window.speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
            }
        }

        copyText(text, button) {
            navigator.clipboard.writeText(text).then(() => {
                button.classList.add('copied');
                setTimeout(() => {
                    button.classList.remove('copied');
                }, 1000);
            }).catch(err => {
                console.error('Errore durante la copia:', err);
            });
        }

        speakText(text, button) {
            // Ferma qualsiasi speech in corso
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                // Rimuovi la classe playing da tutti i bottoni
                this._shadowRoot.querySelectorAll('.speaker-button').forEach(btn => {
                    btn.classList.remove('playing');
                });
                return;
            }

            const speech = new SpeechSynthesisUtterance(text);
            // Use the selected language
            speech.lang = this.languageSelection || 'it-IT';
            speech.pitch = this.speechPitch; // Pitch (range: 0 to 2)
            speech.rate = this.speechRate; // Rate (range: 0.1 to 10)
            speech.volume = this.speechVolume; // Volume (range: 0 to 1)

            // Usa la voce selezionata nel costruttore
            if (this.selectedVoice) {
                speech.voice = this.selectedVoice;
            }

            button.classList.add('playing');

            speech.onend = () => {
                button.classList.remove('playing');
            };

            speech.onerror = () => {
                button.classList.remove('playing');
                console.error('Errore nella sintesi vocale');
            };

            window.speechSynthesis.speak(speech);
        }

        addSpeechToText() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                this._recognition = new SpeechRecognition();
                this._recognition.lang = this.languageSelection;
                this._recognition.interimResults = true;
                this._recognition.maxAlternatives = 1;
                this._recognition.continuous = true;
                
                let silenceTimer = null;
    
                this._recognition.onresult = (event) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        transcript += event.results[i][0].transcript;
                    }
                    this.userInput.value = transcript;
                    
                    // Reset del timer ogni volta che viene rilevato parlato
                    if (silenceTimer) {
                        clearTimeout(silenceTimer);
                    }
                    
                    // Avvia timer di 2 secondi per lo spegnimento automatico e invio LLM
                    silenceTimer = setTimeout(async () => {
                        if (this._recognition) {
                            this._recognition.stop();
                            // Dopo aver fermato il microfono, invia il messaggio al LLM
                            await this._handleLlm();
                        }
                    }, 2000);
                };

                this._recognition.onend = () => {
                    this.micButton.style.backgroundColor = '';
                    if (silenceTimer) {
                        clearTimeout(silenceTimer);
                        silenceTimer = null;
                    }
                };
    
                this.micButton.addEventListener('click', () => {
                    if (this._recognition.recognizing) {
                        this._recognition.stop();
                        if (silenceTimer) {
                            clearTimeout(silenceTimer);
                            silenceTimer = null;
                        }
                    } else {
                        this._recognition.start();
                        this.micButton.style.backgroundColor = '#ffcccc';
                    }
                });

            } else {
                this.micButton.disabled = true;
                this.micButton.title = "SpeechRecognition non supportato dal browser";
            }
           
        };

        clearChatMessage(tipologiaChat) {
            if (tipologiaChat.toUpperCase() !== 'CHAT') {
                this.generatedAnalysis.innerHTML = '';
            }
        }

        addChatMessage(text, role = 'assistant') {
            if (role === 'assistant') {
                // Crea un contenitore per messaggio + bottone
                const messageRow = document.createElement('div');
                messageRow.classList.add('message-row', 'assistant');

                const bubble = document.createElement('div');
                bubble.classList.add('chat-bubble', role);
                bubble.innerHTML = text; // Usa innerHTML per renderizzare HTML

                const speakerButton = document.createElement('button');
                speakerButton.classList.add('speaker-button');
                speakerButton.title = 'Ascolta il messaggio';
                speakerButton.addEventListener('click', () => {
                    this.speakText(text, speakerButton);
                });

                const copyButton = document.createElement('button');
                copyButton.classList.add('copy-button');
                copyButton.title = 'Copia il messaggio';
                copyButton.addEventListener('click', () => {
                    this.copyText(text, copyButton);
                });

                messageRow.appendChild(bubble);
                messageRow.appendChild(speakerButton);
                messageRow.appendChild(copyButton);
                this.generatedAnalysis.appendChild(messageRow);
            } else {
                // Per i messaggi utente, mantieni il comportamento originale
                const bubble = document.createElement('div');
                bubble.classList.add('chat-bubble', role);
                bubble.textContent = text;
                this.generatedAnalysis.appendChild(bubble);
            }
        
            // auto scroll
            this.generatedAnalysis.scrollTop = this.generatedAnalysis.scrollHeight;
        }

        async useLLM(message) {

            //const dynamicParams = this.getLLMParameters() //TODO: implementare

            let messages = [];
            messages.push({ role: "system", content: "Sei un assistente che deve estrarre i dati allegati a questa richiesta" });
            messages.push({ role: "system", content: this._systemMessage });
            messages.push({ role: "system", content: "Questi sono i dati: " + JSON.stringify(this._dataJson) });
            messages.push({ role: "user", content: message });

            let bodyMessages ={};
            bodyMessages = {
                "messages": messages,
                "output": null,
                "ai_group": "default",
                "ai_model": "gemini-2.5-flash"
                //"properties": {"temperature": 1}
            }

            var requestOptions = {
                method: 'POST',
                headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': 'Bearer ' + this.sapAiToken
                        },
                body: JSON.stringify(bodyMessages)

            };

            try {
                const response = await fetch(this._serviceUrl, requestOptions);   //'https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2/inference/deployments/d62a8d86af505498/chat/completions?api-version=2023-12-01-preview'
                var jsonData = await response.json();

                return this.markdownToHtml(jsonData.message);
            }
            catch (error) {

                return "Errore nella chiamata al LLM: " + error.message;
            }
        }

        markdownToHtml(markdown) {
            if (!markdown) return '';
            
            let html = markdown;
            
            // Escape HTML entities
            html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            // Code blocks (```)
            html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
            
            // Inline code (`)
            html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
            
            // Headers
            html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
            html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
            html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
            
            // Bold (**text** or __text__)
            html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
            
            // Italic (*text* or _text_)
            html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
            html = html.replace(/_(.+?)_/g, '<em>$1</em>');
            
            // Strikethrough (~~text~~)
            html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
            
            // Links [text](url)
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
            
            // Unordered lists (- or *)
            html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
            html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
            
            // Ordered lists (1. 2. etc)
            html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
            
            // Horizontal rule (--- or ***)
            html = html.replace(/^(---|\*\*\*)$/gm, '<hr>');
            
            // Line breaks
            html = html.replace(/\n\n/g, '</p><p>');
            html = html.replace(/\n/g, '<br>');
            
            // Wrap in paragraph
            html = '<p>' + html + '</p>';
            
            // Clean up empty paragraphs
            html = html.replace(/<p><\/p>/g, '');
            html = html.replace(/<p>(<h[123]>)/g, '$1');
            html = html.replace(/(<\/h[123]>)<\/p>/g, '$1');
            html = html.replace(/<p>(<ul>)/g, '$1');
            html = html.replace(/(<\/ul>)<\/p>/g, '$1');
            html = html.replace(/<p>(<pre>)/g, '$1');
            html = html.replace(/(<\/pre>)<\/p>/g, '$1');
            html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
            
            return html;
        }

        // Helper method to get token for SAP AI
        async getToken() {

            console.log(this);
            const secrets = privateData.get(this);
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
            myHeaders.append('Authorization', 'Basic ' + btoa(secrets.clientId + ':' + secrets.clientSecret));

            var urlencoded = new URLSearchParams();
            urlencoded.append("grant_type", "client_credentials");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            try {
                const response = await fetch(this._authUrl + '/oauth/token', requestOptions);
                var jsonData = await response.json();
                
                this.sapAiToken = jsonData.access_token;
            }
            catch (error) {
                console.log(error);
            }
        }

        async callLLMForSuggestions(messages) {


            let resultLLM = "";

            try {
                if (!this.sapAiToken) await this.getToken();
                    resultLLM = await this.useLLM(messages);
                }
            catch (error) {
                console.log(error);
                resultLLM = "Errore durante la comunicazione con il LLM: " + error.message;
            }

            return resultLLM;
        }

        getDataSource() {
            this._dataJson = this.readDataSource(this.myDataSource);
        }

        readDataSource(inData) {
            // Verifichiamo lo stato
            if (inData && inData.state === "success") {
                console.log('readDatasource');
                const data = inData.data;
                const dimensions = inData.metadata.dimensions;
                const measures = inData.metadata.mainStructureMembers;
            let result = [];

            for (const record of data) {
                const parsedRecord = {
                    // parse dimensions
                    ...Object.keys(dimensions).reduce((acc, dim) => {
                        if (record.hasOwnProperty(dim)) {
                            acc[dimensions[dim].description] = record[dim].label;
                        }
                        return acc;
                    }, {}),
                    // parse measures
                    ...Object.keys(measures).reduce((acc, measure) => {
                        if (record.hasOwnProperty(measure)) {
                            acc[measures[measure].label] = record[measure].raw;
                        }
                        return acc;
                    }, {})
                };
                
                result.push(parsedRecord);
            }

            // Crea CSV con testata
            const csv = this.convertToCSV(result);
            console.log('CSV generato:', csv);

            return csv;
            }
        }

        convertToCSV(jsonData) {
            if (!jsonData || jsonData.length === 0) {
                return '';
            }

            // Estrai le chiavi (testata) dal primo oggetto
            const headers = Object.keys(jsonData[0]);
            
            // Crea la riga di testata
            const csvHeader = headers.join(',');
            
            // Crea le righe di dati
            const csvRows = jsonData.map(row => {
                return headers.map(header => {
                    const value = row[header];
                    // Gestisci valori con virgole o virgolette
                    if (value === null || value === undefined) {
                        return '';
                    }
                    const stringValue = String(value);
                    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                        return `"${stringValue.replace(/"/g, '""')}"`;
                    }
                    return stringValue;
                }).join(',');
            });
            
            // Combina testata e righe
            return [csvHeader, ...csvRows].join('\n');
        }

        parseJsonData(sData) {
            let jsonData = JSON.parse(sData);
            let data = jsonData.data;
            let dimensions = jsonData.metadata.dimensions;
            let measures = jsonData.metadata.mainStructureMembers;
            let result = [];

            for (let i = 0; i < data.length; i++) {
                let record = data[i];
                let parsedRecord = {};

                // parse dimensions
                for (let dim in dimensions) {
                    if (record.hasOwnProperty(dim)) {
                        let field_name = dimensions[dim].id;
                        let value = record[dim].label;
                        parsedRecord[field_name] = value;
                    }
                }

                // parse measures
                for (let measure in measures) {
                    if (record.hasOwnProperty(measure)) {
                        let field_name = measures[measure].id;
                        let value = record[measure].raw;
                        parsedRecord[field_name] = value;
                    }
                }

                result.push(parsedRecord);
            }

            return result;
        }
    });
}
)();