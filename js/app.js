function ksort(obj) {
    var keys = Object.keys(obj).sort()
        , sortedObj = {};

    for (var i in keys) {
        sortedObj[keys[i]] = obj[keys[i]];
    }

    return sortedObj;
}

var loadPictures = function () {

    var pdfSrc = '/testmag.pdf';
    var pdfDoc;
    var scale = 1.5;

    window.loaded = 0;
    window.arrSrc = {};

    // PDFJS.disableWorker = true;
    PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

    PDFJS.getDocument(pdfSrc).then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;

        console.log(pdfDoc)

        var numPages = pdfDoc.numPages;
        // var numPages = 4;

        for (var i = 1; i <= numPages; i++) {
            addCanvasPage(i, numPages);
        }

    });

    var appendPictures = function (maxW, maxH) {
        ksort(arrSrc);

        var magazine = document.querySelector('.pdf');

        $.each(arrSrc, function (i, value) {

            var img = document.createElement('div');
            img.setAttribute('data-page', i);
            img.setAttribute('style', 'background-image: url(' + value.src + ')');

            if(value.double) {
                var img_clone = img.cloneNode(true);
                img_clone.setAttribute('class', 'double double-left');
                magazine.appendChild(img_clone);

                img.setAttribute('class', 'double double-right');
            }

            magazine.appendChild(img);

            if(value.double) {
                console.log('cut');
            }
        });

        var h = $(window).height() - 40;
        var w = Math.ceil(maxW * h / maxH);

        console.log(w, h);

        setTimeout(function () {
            // $('.magazine .double').scissor();
            loadApp(w, h);
            // $('#canvas').show();
        }, 1000);
    };

    var addCanvasPage = function (num, max) {

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var maxW = 0;
        var maxH = 0;

        pdfDoc.getPage(num).then(function (page) {
            var scale = 1;
            var viewport = page.getViewport(scale);
            //
            // Prepare canvas using PDF page dimensions
            //
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            //
            // Render PDF page into canvas context
            //
            var task = page.render({canvasContext: ctx, viewport: viewport})
            task.promise.then(function () {

                if(viewport.width > maxW) {
                    maxW = viewport.width;
                }

                if(viewport.height > maxH) {
                    maxH = viewport.height;
                }

                arrSrc[num] = {
                    double: viewport.width > viewport.height,
                    src: canvas.toDataURL('image/jpeg'),
                };

                loaded++;

                var percent = Math.floor((loaded) / max * 100);
                if(parent > 50) return;
                $('.progress').text(percent + '%').width(percent + '%');


                if (loaded === max) {
                    appendPictures(maxW, maxH);
                }
            });
        });

    };

};

