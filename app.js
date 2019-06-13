var apiKey = 'AIzaSyCxMAxsVyLu9nQ4KbBffJN2Mpbbx0j6z7A';

function init() {
    
    gapi.client.setApiKey(apiKey);
    gapi.client.load("youtube", "v3", function () {});

}

function search(term) {

    //monta um objeto que cont�m os parametros que a API ir� utilizar, incluindo o termo
    var request = gapi.client.youtube.search.list({
        part: "id, snippet",
        q: term,
        type: 'video',
        order: 'date',
        maxresults: 30
    });

    //Aqui, de fato, realiza a busca na API
    request.execute(function (results) {

        //Este bloco aqui executa quando a API retorna resultados
        renderSearchResults(results);
    });
}

//Esta fun��o � respons�vel por analisar e renderizar os resultados de acordo
function renderSearchResults(results) {

    if (results && results.items.length > 0) { //"Retornou resultados?"

        var searchContainer = $('#searchResultsContainer').find('.col');
        var resultItemsContainer = $('<ul/>').attr('id', 'resultItems').addClass('list-group');
        var resultItemTemplate = $('<li />').addClass('list-group-item');

        //Esvazia o container para receber novo conte�do
        searchContainer.empty();
        
        //L� cada item do resultado e monta um html customizado utilizando a estrutura retornada pelo servi�o
        $(results.items).each(function (index, elem) {

            var html = '<div class="float-left">';
            html += '<iframe frameborder = "0" allowfullscreen class="embed-responsive-item" src = "https://www.youtube.com/embed/' + elem.id.videoId + '" ></iframe>';
            html += '</div>';
            html += '<div class="float-right">';
            html += '<p>' + elem.snippet.title + '</p>';
            html += '<p>' + elem.snippet.description + '</p>';
            html += '<p>' + elem.snippet.publishedAt + '</p>';
            html += '</div>';
            html += '<div class="clearfix"></div>';

            resultItemTemplate.clone()
                              .html(html)
                              .appendTo(resultItemsContainer);
        });

        searchContainer.append(resultItemsContainer);

        displaySearchResultsPanel();
    } else { //N�o tem resultados
        displaySearchWithNoResultsPanel();
    }

}

function displaySearchResultsPanel() {
    $('#searchResultsContainer').removeClass('d-none');
    $('#searchWithNoResultsContainer').addClass('d-none');
}

function displayVideoPanel() {
    $('#searchResultsContainer').addClass('d-none');
    $('#searchWithNoResultsContainer').addClass('d-none');
}

function displaySearchWithNoResultsPanel() {
    $('#searchResultsContainer').addClass('d-none');
    $('#searchWithNoResultsContainer').removeClass('d-none');
}

//C�digo de inicializa��o
$(function (e) {
    
    $('#frmVideoSearch').on('submit', function(e) {
        e.preventDefault();

        //Obt�m o termo do campo texto
        var term = encodeURIComponent($('#txtSearch').val()).replace(/%20/g,'+');

        //Manda buscar
        search(term);
    });
    
});