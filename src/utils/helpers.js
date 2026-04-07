/**
 * Formatting helpers for ROAM PK platform
 */

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        maximumFractionDigits: 0
    }).format(amount);
};

export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
};

export const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

export const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
        case 'easy': return 'text-success';
        case 'moderate': return 'text-accent';
        case 'hard': return 'text-danger';
        default: return 'text-text-muted';
    }
}
