// This should originally not be a styling panel but a builder panel. However, when using data binding, including a builder panel will replace the data binding configuration dialog.
(function () {
    let template = document.createElement("template")
    template.innerHTML = `

    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SAP-Style Accordion Form</title>
        <style>
            :host {
                --primary-1: #EBF8FF;
                --primary-2: #0070F2;
                --primary-3: #FFFFFF;
                --primary-4: #F5F6F7;
                --primary-5: #758CA4;
                --primary-6: #131E29;
                --primary-7: #556B82;
                --ui-color: #7858FF;
                --danger-color: #AA0808;
                font-family: '72', 'Segoe UI', Arial, sans-serif;
                color: var(--primary-6);
                display: block;
                height: 100%;
                overflow: auto;
            }

            * {
                box-sizing: border-box;
                font-family: inherit;
            }

            body {
                background-color: var(--primary-4);
                color: var(--primary-6);
                margin: 0;
                padding: 16px;
                min-height: 100%;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
            }

            form {
                width: 100%;
                max-width: 100%;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
            }

            .accordion {
                border: 1px solid rgba(117, 140, 164, 0.25);
                border-radius: 8px;
                margin-bottom: 8px;
                overflow: hidden;
                background-color: var(--primary-3);
            }

            .accordion-header {
                background-color: var(--primary-3);
                padding: 8px 16px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background-color 0.2s ease, box-shadow 0.2s ease;
            }

            .accordion-header:hover {
                background-color: #eaecee;
                box-shadow: inset 0 -1px 0 rgba(117, 140, 164, 0.2);
            }

            .accordion-header.active {
                background-color: var(--primary-1);
                border-bottom: 1px solid rgba(117, 140, 164, 0.25);
            }

            .accordion-title {
                font-weight: 700;
                color: var(--primary-6);
                font-size: 15px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .accordion-icon {
                width: 20px;
                height: 20px;
                color: var(--ui-color);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .accordion-arrow {
                width: 16px;
                height: 16px;
                transition: transform 0.3s ease;
                color: var(--primary-7);
            }

            .accordion-header.active .accordion-arrow {
                transform: rotate(180deg);
            }

            .accordion-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
                background-color: var(--primary-3);
            }

            .accordion-content.active {
                max-height: 9999px;
            }

            .accordion-inner {
                padding: 12px 16px 16px;
            }

            table {
                width: 100%;
                border-spacing: 0;
                border-collapse: separate;
            }

            td {
                padding: 10px 8px;
                vertical-align: middle;
                color: var(--primary-6);
                font-size: 13px;
                line-height: 1.5;
                border-bottom: 1px solid rgba(117, 140, 164, 0.1);
            }

            tr:last-child td {
                border-bottom: none;
            }

            td:first-child {
                width: 42%;
                font-weight: 600;
                color: var(--primary-7);
            }

            textarea,
            input[type="number"],
            input[type="text"],
            input[type="url"],
            input[type="password"],
            select {
                width: 100%;
                font-size: 13px;
                border: 1px solid rgba(117, 140, 164, 0.45);
                border-radius: 8px;
                color: var(--primary-6);
                background-color: var(--primary-1);
                padding: 8px 12px;
                transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
            }

            textarea {
                resize: vertical;
                min-height: 100px;
            }

            input:focus,
            select:focus,
            textarea:focus {
                outline: none;
                border-color: var(--ui-color);
                box-shadow: 0 0 0 3px rgba(0, 87, 210, 0.2);
                background-color: var(--primary-3);
            }

            input::placeholder,
            textarea::placeholder {
                color: var(--primary-7);
                opacity: 0.75;
            }

            input[type="color"] {
                width: 100%;
                height: 40px;
                border: 1px solid rgba(117, 140, 164, 0.45);
                border-radius: 8px;
                background: transparent;
                padding: 0;
                cursor: pointer;
            }

            input[type="color"]::-webkit-color-swatch-wrapper {
                padding: 0;
                border-radius: inherit;
            }

            input[type="color"]::-webkit-color-swatch {
                border: none;
                border-radius: inherit;
            }

            input[type="color"]::-moz-color-swatch {
                border: none;
                border-radius: 8px;
            }

            .parameter-row {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                gap: 8px;
            }

            .parameter-row input[type="text"] {
                flex: 1;
                min-width: 120px;
            }

            .parameter-row input[type="text"]:first-child {
                flex: 0 0 160px;
            }

            .parameter-row input[type="text"]:nth-child(2) {
                flex: 1;
            }

            .remove-parameter-button {
                border: 1px solid var(--danger-color);
                color: var(--danger-color);
                background-color: var(--primary-3);
                border-radius: 10px;
                cursor: pointer;
                padding: 8px 11px;
                font-size: 12px;
                min-width: auto;
                width: auto;
                flex: 0 0 auto;
                font-weight: 600;
                transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
            }

            .remove-parameter-button:hover {
                background-color: var(--danger-color);
                color: var(--primary-3);
                box-shadow: 0 8px 18px rgba(170, 8, 8, 0.2);
            }

            .logoWrapper {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .uploadLogoButton {
                position: relative;
                overflow: hidden;
                display: inline-block;
                cursor: pointer;
            }

            .file-upload-button,
            .remove-image-button {
                border: 1px solid rgba(117, 140, 164, 0.45);
                color: var(--primary-6);
                background-color: var(--primary-3);
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
            }

            .file-upload-button:hover,
            .remove-image-button:hover {
                border-color: var(--ui-color);
                color: var(--ui-color);
                background-color: var(--primary-1);
                box-shadow: 0 10px 24px rgba(0, 87, 210, 0.15);
            }

            .file-upload-button:before {
                content: "";
                font-family: "SAP-icons";
            }

            .remove-image-button:before {
                content: "";
                font-family: "SAP-icons";
            }

            .file-upload-input {
                font-size: 100px;
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
                cursor: pointer;
            }

            #logo {
                display: none;
            }

            .info-icon {
                width: 16px;
                height: 16px;
                margin-left: 8px;
                cursor: help;
                vertical-align: middle;
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .tooltip {
                visibility: hidden;
                background-color: var(--primary-6);
                color: var(--primary-3);
                text-align: left;
                padding: 8px 12px;
                border-radius: 8px;
                position: absolute;
                z-index: 1;
                width: 220px;
                left: 24px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 12px;
                line-height: 1.4;
                opacity: 0;
                transition: opacity 0.2s ease;
                box-shadow: 0 16px 32px rgba(19, 30, 41, 0.2);
            }

            .info-icon:hover .tooltip {
                visibility: visible;
                opacity: 1;
            }

            .tooltip::before {
                content: "";
                position: absolute;
                left: -6px;
                top: 50%;
                transform: translateY(-50%);
                border-width: 6px 6px 6px 0;
                border-style: solid;
                border-color: transparent var(--primary-6) transparent transparent;
            }

            .checkbox-container {
                display: inline-block;
                position: relative;
                padding-left: 28px;
                cursor: pointer;
                user-select: none;
                vertical-align: middle;
                color: inherit;
                font-weight: 600;
            }

            .checkbox-container input {
                position: absolute;
                opacity: 0;
                cursor: pointer;
                height: 0;
                width: 0;
            }

            .checkbox-container .checkmark {
                position: absolute;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                height: 18px;
                width: 18px;
                background-color: var(--primary-3);
                border: 1px solid rgba(117, 140, 164, 0.6);
                border-radius: 4px;
                transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
            }

            .checkbox-container input:checked+.checkmark {
                background-color: var(--ui-color);
                border-color: var(--ui-color);
                box-shadow: 0 6px 16px rgba(0, 87, 210, 0.2);
            }

            .checkbox-container .checkmark:after {
                content: "";
                position: absolute;
                display: none;
            }

            .checkbox-container input:checked+.checkmark:after {
                display: block;
            }

            .checkbox-container .checkmark:after {
                left: 50%;
                top: 46%;
                width: 4px;
                height: 8px;
                border: solid var(--primary-3);
                border-width: 0 2px 2px 0;
                transform: translate(-50%, -50%) rotate(45deg);
            }

            input[type="range"] {
                -webkit-appearance: none;
                width: 100%;
                height: 4px;
                margin: 6px 0;
                background: transparent;
            }

            input[type="range"]::-webkit-slider-runnable-track {
                width: 100%;
                height: 4px;
                background: linear-gradient(to right, var(--ui-color) 0%, var(--ui-color) var(--value, 0%), rgba(117, 140, 164, 0.3) var(--value, 0%), rgba(117, 140, 164, 0.3) 100%);
                border-radius: 2px;
            }

            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: var(--ui-color);
                cursor: pointer;
                margin-top: -5px;
                box-shadow: 0 6px 12px rgba(0, 87, 210, 0.2);
            }

            input[type="range"]::-moz-range-track {
                width: 100%;
                height: 4px;
                background: rgba(117, 140, 164, 0.3);
                border-radius: 2px;
            }

            input[type="range"]::-moz-range-thumb {
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: var(--ui-color);
                cursor: pointer;
                border: none;
                box-shadow: 0 6px 12px rgba(0, 87, 210, 0.2);
            }

            input[type="range"]::-moz-range-progress {
                background-color: var(--ui-color);
                height: 4px;
                border-radius: 2px;
            }

            .range-field {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .range-value {
                min-width: 24px;
                font-size: 12px;
                font-weight: 600;
                color: var(--primary-6);
                text-align: right;
            }

            .accent-picker {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 8px;
                padding-bottom: 8px;
            }

            .accent-option {
                border: 1px solid rgba(117, 140, 164, 0.4);
                border-radius: 8px;
                background-color: var(--primary-3);
                padding: 8px 12px;
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                color: var(--primary-7);
                transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, color 0.2s ease;
            }

            .accent-option::before {
                content: "";
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: var(--swatch-color, var(--ui-color));
                box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.6);
            }

            .accent-option:hover {
                border-color: var(--ui-color);
                color: var(--primary-6);
                box-shadow: 0 12px 24px rgba(0, 87, 210, 0.18);
                transform: translateY(-2px);
            }

            .accent-option.selected {
                border-color: var(--ui-color);
                background-color: var(--primary-1);
                color: var(--primary-6);
                box-shadow: 0 14px 28px rgba(0, 87, 210, 0.22);
            }

            .accent-custom {
                margin-top: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                color: var(--primary-7);
            }

            .accent-custom-inputs {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .accent-custom-inputs input[type="color"] {
                flex: 0 0 40px;
                height: 32px;
                padding: 0;
                border-radius: 8px;
            }

            .accent-custom-inputs input[type="text"] {
                flex: 1;
                height: 32px;
                padding: 0 8px;
                border-radius: 8px;
                font-size: 12px;
            }

            datalist {
                display: flex;
                justify-content: space-between;
                width: 150px;
                margin-top: 5px;
                color: var(--primary-7);
                font-size: 10px;
            }

            option {
                padding: 0;
                font-size: 10px;
            }
        </style>
    </head>

    <body>
        <form id="form">

            <div class="accordion">
                <div class="accordion-header">
                    <div class="accordion-title">
                        <div class="accordion-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                                fill="currentColor">
                                <path
                                    d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
                                <path
                                    d="M5 12.5h2v-1H5V10h3v1.5H6v1h2V14H5v-1.5zm12-1H15V9h-2v6h2v-2.5h2V14h1V9h-1v2.5zm-7 1.5h1v-4h-1V9h3v1.5h-1v4h1V16h-3v-1.5z" />
                            </svg>
                        </div>
                        API Settings
                    </div>
                    <div class="accordion-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                            fill="currentColor">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                        </svg>
                    </div>
                </div>
                <div class="accordion-content">
                    <div class="accordion-inner">
                        <table>
                            <tr>
                                <td>Service Endpoint URL</td>
                                <td><input id="serviceUrl" type="url" placeholder="https://www.example.com/llm"
                                        value="">
                                </td>
                            </tr>
                            <tr>
                                <td>Authentication URL</td>
                                <td><input id="authUrl" type="url" placeholder=""></td>
                            </tr>
                            <tr>
                                <td>Client ID</td>
                                <td><input id="clientId" type="text" placeholder=""></td>
                            </tr>
                            <tr>
                                <td>Client Secret</td>
                                <td><input id="clientSecret" type="password" placeholder=""></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            <div class="accordion">
                <div class="accordion-header">
                    <div class="accordion-title">
                        <div class="accordion-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                                fill="currentColor">
                                <path
                                    d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
                                <path
                                    d="M5 12.5h2v-1H5V10h3v1.5H6v1h2V14H5v-1.5zm12-1H15V9h-2v6h2v-2.5h2V14h1V9h-1v2.5zm-7 1.5h1v-4h-1V9h3v1.5h-1v4h1V16h-3v-1.5z" />
                            </svg>
                        </div>
                        Dialog settings
                    </div>
                    <div class="accordion-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                            fill="currentColor">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                        </svg>
                    </div>
                </div>
                <div class="accordion-content">
                    <div class="accordion-inner">
                        <table>
                            <tr>
                                <td>Modalità conversazione</td>
                                <td>
                                    <select id="tipologiaChat">
                                        <option value="bloccato">Bloccato</option>
                                        <option value="singolo" selected>Singolo Messaggio</option>
                                        <option value="chat">Chat</option>
                                    </select>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            <div class="accordion">
                <div class="accordion-header">
                    <div class="accordion-title">
                        <div class="accordion-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                                fill="currentColor">
                                <path
                                    d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
                                <path
                                    d="M5 12.5h2v-1H5V10h3v1.5H6v1h2V14H5v-1.5zm12-1H15V9h-2v6h2v-2.5h2V14h1V9h-1v2.5zm-7 1.5h1v-4h-1V9h3v1.5h-1v4h1V16h-3v-1.5z" />
                            </svg>
                        </div>
                        LLM settings
                    </div>
                    <div class="accordion-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
                            fill="currentColor">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
                        </svg>
                    </div>
                </div>
                <div class="accordion-content">
                    <div class="accordion-inner">
                        <table>
                            <tr>
                                <td>System Message</td>
                                <td><input id="systemMessage" type="text"></td>
                            </tr>
                            <tr id="userMessageRow" style="display: none;">
                                <td>User Message</td>
                                <td><input id="userMessage" type="text"></td>
                            </tr>
                            <tr>
                                <td>Llm properties (json)</td>
                                <td><input id="llmProperties" type="text"></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

        </form>
    </body>

    </html>
        `

    class SettingsPanel extends HTMLElement {
        constructor() {
            super()

            this._shadowRoot = this.attachShadow({ mode: "open" })
            this._shadowRoot.appendChild(template.content.cloneNode(true))
            this._shadowRoot.getElementById("form").addEventListener("change", this._submit.bind(this))

            this._shadowRoot.querySelectorAll(".accordion-header").forEach(header => {
                header.addEventListener("click", () => {
                    this.toggleAccordion(header);
                });
            })

            // Gestione visibilità User Message
            const tipologiaChatSelect = this._shadowRoot.getElementById("tipologiaChat");
            tipologiaChatSelect.addEventListener("change", () => {
                this.toggleUserMessageVisibility();
            });

        }

        _submit(e) {
            e.preventDefault()
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        serviceUrl: this.serviceUrl,
                        clientId: this.clientId,
                        clientSecret: this.clientSecret,
                        authUrl: this.authUrl,
                        tipologiaChat: this.tipologiaChat,
                        systemMessage: this.systemMessage,
                        userMessage: this.userMessage,
                        llmProperties: this.llmProperties
                    }
                }
            }))
        }

        toggleAccordion(header) {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            content.classList.toggle('active');
        }

        toggleUserMessageVisibility() {
            const userMessageRow = this._shadowRoot.getElementById("userMessageRow");
            const tipologiaChat = this._shadowRoot.getElementById("tipologiaChat").value;
            userMessageRow.style.display = tipologiaChat === 'bloccato' ? '' : 'none';
        }

        set serviceUrl(serviceUrl) { this._shadowRoot.getElementById("serviceUrl").value = serviceUrl }
        get serviceUrl() { return this._shadowRoot.getElementById("serviceUrl").value }

        set authUrl(authUrl) { this._shadowRoot.getElementById("authUrl").value = authUrl }
        get authUrl() { return this._shadowRoot.getElementById("authUrl").value }

        set clientId(clientId) { this._shadowRoot.getElementById("clientId").value = clientId }
        get clientId() { return this._shadowRoot.getElementById("clientId").value }

        set clientSecret(clientSecret) { this._shadowRoot.getElementById("clientSecret").value = clientSecret }
        get clientSecret() { return this._shadowRoot.getElementById("clientSecret").value }

        set tipologiaChat(tipologiaChat) { this._shadowRoot.getElementById("tipologiaChat").value = tipologiaChat }
        get tipologiaChat() { return this._shadowRoot.getElementById("tipologiaChat").value }

        set systemMessage(systemMessage) { this._shadowRoot.getElementById("systemMessage").value = systemMessage }
        get systemMessage() { return this._shadowRoot.getElementById("systemMessage").value }

        set userMessage(userMessage) { 
            this._shadowRoot.getElementById("userMessage").value = userMessage || ''
            this.toggleUserMessageVisibility()
        }
        get userMessage() { return this._shadowRoot.getElementById("userMessage").value }

        set llmProperties(llmProperties) { this._shadowRoot.getElementById("llmProperties").value = llmProperties }
        get llmProperties() { return this._shadowRoot.getElementById("llmProperties").value }
    }

    customElements.define("com-sap-sac-aianalyzer-aps", SettingsPanel)
})()
