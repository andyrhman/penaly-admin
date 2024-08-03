// Utility function to convert permission names
export const ConvertPermissionName = (name) => {
    // Define a dictionary for English to Indonesian translations
    const translations = {
        "view_users": "Lihat Pengguna",
        "edit_users": "Edit Pengguna",
        "view_roles": "Lihat Peran",
        "edit_roles": "Edit Peran",
        "view_articles": "Lihat Artikel",
        "edit_articles": "Edit Artikel",
        "view_comments": "Lihat Komentar",
        "edit_comments": "Edit Komentar",
        "view_categories": "Lihat Kategori",
        "edit_categories": "Edit Kategori"
    };

    return translations[name] || name;
};