var esprima = require('esprima');

module.exports = {

    containsPatterns: function (file, patterns) {
        var contained = false;

        if (patterns.length) {
            patterns.forEach(function (pattern) {
                if (pattern.test(file) && !contained) {
                    contained = true;
                }
            });
        }

        return contained;
    },

    doNotContainsPatterns: function (file, patterns) {
        var contained = false;

        if (patterns.length) {
            patterns.forEach(function (pattern) {
                if (pattern.test(file) && !contained) {
                    contained = true;
                }
            });
        }

        return !contained;
    },

    getCode: function (content) {
        return esprima.parse(content, {comment: true});
    },

    hasCommentWith: function (code, commentRegExp) {
        var hasComment = false;
        var comments = code.comments || [];

        hasComment = comments.some(function (comment) {
            return commentRegExp.test(comment.value);
        });

        return hasComment;
    }

};