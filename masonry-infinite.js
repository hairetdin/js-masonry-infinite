function getUrlSearchParams(url, k){
  var p={};
  var url = url === undefined ? location.search : url
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
  return k?p[k]:p;
}

;var infiniteMasonry = (function(){
  var offset = 200;
  var infiniteContainerClass = ".infinite-container";
  var nextPageClass = ".pagination__next";
  var bottomInfinit;
  var nextPage = $(nextPageClass).last().attr('href');
  var nextPageDict = getUrlSearchParams(nextPage);
  var nextPageResponse = $(nextPageClass).attr('href');
  var nextPageResponseDict = getUrlSearchParams(nextPageResponse);
  // console.log('nextPageDict; nextPageResponseDict', nextPageDict, nextPageResponseDict);

  window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
      // Handle page restore.
      //window.location.reload();
      $masonryGrid.masonry('destroy');
      $(infiniteContainerClass).html(history.state['infiniteHTML']);
      $masonryGrid = $(infiniteContainerClass).masonry({
        // options
        itemSelector: '.element-item',
        //itemSelector: '.card',
        columnWidth: 300, //фиксированная ширина
        isFitWidth: true, //фиксированная ширина
        // columnWidth: '.persent-size',
        // percentPosition: true,
        gutter: 10, //отступы
        fitWidth: true, //выравнивание по центру - не работает с резиновой шириной
        // animate:false,
        // resizeable:false,
      });
      console.log('init masonry 2');
      $('html, body').animate({scrollTop: history.state['scrollTop']}, 'slow');
      // console.log('infiniteHTML', history.state['infiniteHTML']);
      // console.log("history.state['bottomInfinit']", history.state['bottomInfinit']);
      bottomInfinit = history.state['bottomInfinit']-offset;
      nextPageResponseDict['page'] = history.state['nextPage'];
      console.log("nextPageResponseDict['page'] = history.state['nextPage']", nextPageResponseDict);
    }
  });

  $masonryGrid = $(infiniteContainerClass).masonry({
    // options
    itemSelector: '.element-item',
    columnWidth: 300,
    isFitWidth: true,
    gutter: 10, //отступы
    fitWidth: true, //выравнивание по центру - не работает с резиновой шириной
  });
  // console.log('init masonry');
  bottomInfinit = $(infiniteContainerClass).height()-offset;
  let infiniteHTML;
  $(window).scroll(function() {
    // console.log($(nextPageClass).offset(), $(window).scrollTop()+$(window).height());
    if ($(window).scrollTop()+$(window).height() > bottomInfinit){
      console.log('$(this).scrollTop()+$(window).height() > bottomInfinit', $(this).scrollTop()+$(window).height(), bottomInfinit);
      bottomInfinit=bottomInfinit+1000; //чтобы дальше не срабатывал, пока новое значение не задам
      // console.log('bottomInfinit - 300', bottomInfinit, $(window).height());
      // var $items = $(
      //   '<div class="card element-item">\
      //     <a href="/event/18697/">\
      //       <img src="/media/events_img/2018/03/28/15963.jpg" alt="tt-1">\
      //     </a>\
      //   </div>'
      // );
      // $masonryGrid.append($items).masonry( 'appended', $items );
      // $masonryGrid.masonry('layout');
      if (nextPageResponseDict['page']) {
        nextPageDict['page'] = nextPageResponseDict['page']
        // console.log('nextPageDict; nextPageResponseDict', nextPageDict, nextPageResponseDict);
        $.get( ".", nextPageDict, function(response){
          let $infinitItems = $($(response).find(infiniteContainerClass).children()); //выдергиваю карточки из ответа
          nextPageResponse = $(response).find(nextPageClass).last().attr('href');
          nextPageResponseDict = getUrlSearchParams(nextPageResponse);
          // $(nextPageClass).last().attr('href', nextPageResponse);
          console.log('setup infinite next page', nextPageResponseDict);
          $masonryGrid.append($infinitItems).masonry( 'appended', $infinitItems );
          // console.log("$(infiniteContainerClass).height()",$(infiniteContainerClass).height());
          bottomInfinit = $(infiniteContainerClass).height()-offset;
        });
      }
      // offset+=300;
    }
  });

  $('body').on('click', 'a', function(){
    // console.log('$(window).scrollTop()',$(window).scrollTop());
    // alert($(window).scrollTop());
    infiniteHTML = document.getElementsByClassName(infiniteContainerClass)[0].innerHTML;
    stateData = {
      infiniteHTML: infiniteHTML,
      scrollTop: $(window).scrollTop(),
      bottomInfinit: bottomInfinit,
      nextPage: nextPageResponseDict['page'],
    };
    // window.history.pushState(stateData, document.title, document.location.href);
    window.history.replaceState(stateData, document.title, document.location.href);
  });
})();
