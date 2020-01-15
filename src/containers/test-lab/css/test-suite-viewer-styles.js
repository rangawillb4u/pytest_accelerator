export default {
    component: {
        width: '500px',
        float: 'bottom',
        display: 'inline-block',
        verticalAlign: 'top',
        // padding: '20px',
        padding: '3px 0px 0 0px',
        '@media (maxwidth: 640px)': {
            width: '100%',
            display: 'block'
        }
    },
    searchBox: {
        width: '500px',
        padding: '0px 0px 0 0px',
        color: '#4f5b66'

    },
    viewer: {
        base: {
            fontSize: '12px',
            whiteSpace: 'pre-wrap',
            backgroundColor: '#282C34',
            border: 'solid 1px black',
            padding: '20px',
            color: '#9DA5AB',
            minHeight: '250px'
        }
    }
};