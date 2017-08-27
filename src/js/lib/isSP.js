import $ from 'jquery';

const SP_FLAG = '.js-sp-flag';

export default function isSP () {
    return $(SP_FLAG).is(':visible');
}