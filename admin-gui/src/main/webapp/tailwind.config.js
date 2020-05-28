colors = {
    'failed' : '#cc1f1a',
    'link' : '#2779bd',
};
spacing = {
    '256' : '64rem',
    '288' : '72rem',
};

module.exports = {
    important: true,
    theme: {
        extend: {
            colors: colors,
            spacing: spacing,
            maxWidth: spacing,
        }
    }
};