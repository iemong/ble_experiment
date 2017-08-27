import $ from 'jquery';

export default class KowaiMovie {
    constructor() {
        this._init();
        this._ytPlayer = null;
    }
    _init() {
        const url = 'https://www.youtube.com/iframe_api';
        const $target = $('body > script:last');
        $target.before(`<script src="${url}"></script>`);
    
        window.onYouTubeIframeAPIReady = () => {
            this._ytPlayer = new YT.Player(
                'youtube', 
                {
                    videoId: 'kfoP62m9Uak', 
                    playerVars: {
                        loop: 1,
                        playlist: 'kfoP62m9Uak',
                        controls: 1,
                        autoplay: 0,
                        showinfo: 1,
                        rel: 0
                    }
                }
            );
        };
    }
    play() {
        this._ytPlayer.playVideo();
        document.body.classList.add('is-kowai');
    }
}