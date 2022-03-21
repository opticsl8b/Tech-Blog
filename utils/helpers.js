// Instead with Moment, use the methods built into the Date object.
// This way, we can avoid bringing in unnecessary dependencies.

module.exports = {
    format_date: (date) => {
      return `${new Date(date).getMonth() + 1}/${new Date(
        date
      ).getDate()}/${new Date(date).getFullYear()}`;
    },
  
    format_plural: (word, amount) => {
      if (amount !== 1) {
        return `${word}s`;
      }
      return word;
    },
  };
  