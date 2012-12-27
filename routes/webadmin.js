
/*
 * GET webadmin
 */

exports.index = function(req, res) {
    req.session.count = req.session.count || 0;
    var n = req.session.count++;

    res.render('webadmin/index', { n: n });
};