export interface IsocialLinks {
    facebook : string,
    instagram : string,
    twitter : string,
    linkedin : string,
    youtube : string,
    tiktok : string
}

export interface IsettingData{
    socialLinks : IsocialLinks,
    _id : string,
    siteName : string,
    siteLogo : string,
    contactEmail : string,
    contactPhone : string,
    contactAddress : string,
    about : string,
    discountBanner : string,
    appInfoBanner : string,
    createdAt : string,
    updatedAt : string
}
export interface ISetting {
    success : boolean,
    message : string,
    data : IsettingData[],
}