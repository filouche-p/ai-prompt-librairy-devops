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
    newDiv.id = 'card-' + title.toLowerCase().split(" ").join("-");

    const titleH3 = document.createElement('h3');
    titleH3.textContent = title;

    const categorySpan = document.createElement('span');
    categorySpan.textContent = category;

    const breakLine = document.createElement('br');

    const promptSpan = document.createElement('span');
    promptSpan.textContent = prompt;

    newDiv.append(titleH3);
    newDiv.append(categorySpan);
    newDiv.append(breakLine);
    newDiv.append(promptSpan);
    
    parent.append(newDiv);
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
}

/* Intercept the form */
const addPromptForm = document.getElementById('addPrompt');

addPromptForm.addEventListener('submit', async (event) => {
    //* Prevent reloading the entire page
    event.preventDefault();

    const formData = new FormData(addPromptForm)

    try {
        const data = Object.fromEntries(formData.entries());
        addPrompt(data);
        
        const newEntry = document.getElementById('card-' + data['title']);
        if(newEntry) {
            newEntry.classList.add('addedByUser');
        }
    } catch (error) {
        console.error("Erreur quand le formulaire d'ajout d'un prompt à été soumis : " + error);
    }
});

const reloadJsonFile = document.getElementById('reloadJsonFile');

reloadJsonFile.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(reloadJsonFile);

    try {
        const data = Object.fromEntries(formData.entries());
        deleteChild(); //* Delete all child that aren't added by the user
        loadPrompts(data['jsonPath'] || "prompts.json");
    } catch (error) {
        console.error("Erreur quand le formulaire de rechargement du fichier json à été soumis : " + error);
    }
});


/* Load propmt card in the body */
const htmlJsonPath = document.getElementById('jsonPath');
loadPrompts((htmlJsonPath && htmlJsonPath.value) || undefined);

console.log("Succesfully load");