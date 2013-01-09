
/*
 * GET webadmin
 */

exports.index = function(req, res) {
    req.session.theme = req.session.theme || "classic";
    var theme = req.session.theme;

    res.render('webadmin/index', { theme: theme });
};