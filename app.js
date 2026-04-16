async function loadJson(jsonPath="prompts.json") {
    try {
        const response = await fetch(jsonPath);
        if(!response.ok) {
            throw new Error('Erreur HTTP : ' + response.status);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors de la lecture de : '" + jsonPath + "' " + error);
    }
}


async function loadPrompt(title, category, prompt, idParent="prompt-container") {
    const parent = document.getElementById(idParent);
    const newDiv = document.createElement('div');
    
    //! If the id alredy exsist need to add number at the end
    newDiv.classList.add('card');
    newDiv.className = 'card bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col h-full group relative overflow-hidden';
    newDiv.id = 'card-' + title.toLowerCase().split(" ").join("-");

    const decorationLine = document.createElement('div');
    decorationLine.className = 'absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity';
    newDiv.append(decorationLine);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'flex justify-between items-start gap-4 mb-3';

    const titleH3 = document.createElement('h3');
    titleH3.className = 'text-base font-bold text-slate-800 leading-tight';
    titleH3.textContent = title;

    const categorySpan = document.createElement('span');
    categorySpan.className = 'shrink-0 bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide border border-indigo-100 uppercase';
    categorySpan.textContent = category;

    headerDiv.append(titleH3);
    headerDiv.append(categorySpan);

    const promptWrapper = document.createElement('div');
    promptWrapper.className = 'bg-slate-50 p-4 rounded-lg border border-slate-100 flex-grow relative';

    const promptSpan = document.createElement('span');
    promptSpan.className = 'text-slate-600 text-sm font-mono whitespace-pre-wrap break-words leading-relaxed block';
    promptSpan.textContent = prompt;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'absolute top-2 right-2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 rounded p-1';
    copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
    copyBtn.title = "Copier le prompt";
    copyBtn.onclick = () => {
        document.execCommand('copy');
        navigator.clipboard.writeText(prompt).catch(()=>{});
        copyBtn.innerHTML = '<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
        setTimeout(() => {
            copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
        }, 2000);
    };

    promptWrapper.append(promptSpan);
    promptWrapper.append(copyBtn);

    newDiv.append(headerDiv);
    newDiv.append(promptWrapper);
    
    parent.append(newDiv);

    const counterElement = document.getElementById('prompt-count');
    if (counterElement) {
        const count = parent.children.length;
        counterElement.textContent = count + (count > 1 ? ' prompts' : ' prompt');
    }
}


async function loadPrompts(jsonPath="prompts.json") {
    const data = await loadJson(jsonPath);
    if(!data) {
        console.error("Erreur lors de la récupération du json.");
    }

    for(let i = 0; i < data.length; i++) {
        const dict = data[i];

        try {
            await loadPrompt(dict["title"], dict["category"], dict["prompt"]);
        } catch (error) {
            if(dict["title"]) {
                console.error("Error lors de la création de la card pour : " + dict["title"] + ". L'erreur suivante est survenue : " + error);
            } else {
                console.error("Il semble impossible de récupérer les éléments depuis le json, sa structure doit ressembler à : [{\"title\" : \"Exemple de prompt\",\"category\": \"Education\",\"prompt\": \"Mon super prompt ici.\"}]");
            }
        }
    }
}


function addPrompt(data) {
    //! Need to check the entries
    //! Need to check that the title is not already taken
    loadPrompt(data['title'], data['category'], data['prompt']);
}

function deleteChild(parentId="prompt-container", classNameExeption="addedByUser") {
    const container = document.getElementById(parentId);
    if(!container) {
        console.error("Impossible de supprimer les enfants de : " + parentId);
        return;
    }

    const elementsASupprimer = container.querySelectorAll(':scope > :not(.' + classNameExeption + ')');
    elementsASupprimer.forEach((el) => {el.remove();console.log(el);});

    const counterElement = document.getElementById('prompt-count');
    if (counterElement) {
        const count = container.children.length;
        counterElement.textContent = count + (count > 1 ? ' prompts' : ' prompt');
    }
}

const addPromptForm = document.getElementById('addPrompt');

addPromptForm.addEventListener('submit', async (event) => {
    //* Prevent reloading the entire page
    event.preventDefault();

    const formData = new FormData(addPromptForm)

    try {
        const data = Object.fromEntries(formData.entries());
        addPrompt(data);
        
        const newEntry = document.getElementById('card-' + data['title'].toLowerCase().split(" ").join("-"));
        if(newEntry) {
            newEntry.classList.add('addedByUser');
            newEntry.classList.add('border-indigo-300', 'bg-indigo-50/30'); // UI bonus
        }
    } catch (error) {
        console.error("Erreur quand le formulaire d'ajout d'un prompt à été soumis : " + error);
    }
});

// const reloadJsonFile = document.getElementById('reloadJsonFile');

// reloadJsonFile.addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const formData = new FormData(reloadJsonFile);

//     try {
//         const data = Object.fromEntries(formData.entries());
//         deleteChild(); //* Delete all child that aren't added by the user
//         loadPrompts(data['jsonPath'] || "prompts.json");
//     } catch (error) {
//         console.error("Erreur quand le formulaire de rechargement du fichier json à été soumis : " + error);
//     }
// });


const htmlJsonPath = document.getElementById('jsonPath');
loadPrompts((htmlJsonPath && htmlJsonPath.value) || undefined);

console.log("Succesfully load");