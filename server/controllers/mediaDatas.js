import { AboutUs, Cards1, Cards2, Carousel } from "../models/media.js";
import upload, { deleteFile } from "../utils/multerConfig.js";





//add carousel
export const addCarousel = async (req, res) => {
    const uploadMiddleware = upload.single('backgroundUrl');

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { header, paragraph, mediaFormat, alt } = req.body;
        const backgroundUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!backgroundUrl) {
            return res.status(400).json({ error: "background is required" });
        }

        const newCarousel = new Carousel({ header, paragraph, backgroundUrl, mediaFormat, alt });
        await newCarousel.save();

        res.status(201).json({ message: "New carousel item successfully created", carousel: newCarousel });
    });
};

//get all carousels
export const getAllCarousels = async (req, res) => {
    const carousels = await Carousel.find().sort({ createdAt: -1, _id: 1 });
    res.status(200).json(carousels);
};

//get filtered carousels
export const getFilteredCarousels = async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    
    let query = {};
  
    if (search) {
      query = { header: { $regex: search, $options: 'i' } };
    }
  
    const total = await Carousel.countDocuments(query);
    const totalPages = Math.ceil(total / limitNumber);
  
    const carousels = await Carousel.find(query)
      .sort({ createdAt: -1, _id: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
  
    if (carousels.length === 0) {
      return res.status(404).json({ message: "No carousels found" });
    }
  
    res.status(200).json({
      message: "Carousels retrieved successfully",
      carousels: carousels,
      currentPage: pageNumber,
      totalPages: totalPages,
      totalItems: total
    });
  };

// edit carousel
export const editCarousel = async (req, res) => {
    const uploadMiddleware = upload.single('backgroundUrl');

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { id } = req.params;
        const { header, paragraph, mediaFormat, alt } = req.body;

        const carousel = await Carousel.findById(id);

        if (!carousel) {
            return res.status(404).json({ error: "Carousel not found" });
        }

        // Update text fields
        carousel.header = header || carousel.header;
        carousel.paragraph = paragraph || carousel.paragraph;
        carousel.mediaFormat = mediaFormat || carousel.mediaFormat;
        carousel.alt = alt || carousel.alt;

        // Update backgroundUrl if a new file is uploaded
        if (req.file) {
            carousel.backgroundUrl = `/uploads/${req.file.filename}`;
        }

        await carousel.save();

        res.status(200).json({ message: "Carousel updated successfully", carousel });
    });
};

// Delete carousel
export const deleteCarousel = async (req, res) => {
    const { id } = req.params;

    const carousel = await Carousel.findById(id);

    if (!carousel) {
        return res.status(404).json({ error: "Carousel not found" });
    }

    if (carousel.backgroundUrl) {
        //delete file from server folder
        await deleteFile(carousel.backgroundUrl);
    }

    // Delete the carousel from the database
    await Carousel.findByIdAndDelete(id);

    return res.status(200).json({ message: "Carousel deleted successfully" });


};







//add about us section
export const addAboutUs = async (req, res) => {
    const uploadMiddleware = upload.single('backgroundUrl');

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { paragraph } = req.body;
        const backgroundUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!backgroundUrl) {
            return res.status(400).json({ error: "background is required" });
        }

        const newAboutUs = new AboutUs({ paragraph, backgroundUrl });
        await newAboutUs.save();

        return res.status(201).json({ message: "New about us item successfully created", aboutUs: newAboutUs });
    });
};


//get about us data
export const getAboutUs = async (req, res) => {
    const aboutUs = await AboutUs.find().sort({ createdAt: -1, _id: 1 });
    res.status(200).json(aboutUs);
};

//get filtered about us
export const getFilteredAboutUs = async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    
    let query = {};
  
    if (search) {
      query = { paragraph: { $regex: search, $options: 'i' } };
    }
  
    const total = await AboutUs.countDocuments(query);
    const totalPages = Math.ceil(total / limitNumber);
  
    const aboutUsEntries = await AboutUs.find(query)
      .sort({ createdAt: -1, _id: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
  
    if (aboutUsEntries.length === 0) {
      return res.status(404).json({ message: "No About Us entries found" });
    }
  
    res.status(200).json({
      message: "About Us entries retrieved successfully",
      aboutUs: aboutUsEntries,
      currentPage: pageNumber,
      totalPages: totalPages,
      totalItems: total
    });
  };

// edit about us data
export const editAboutUS = async (req, res) => {
    const uploadMiddleware = upload.single('backgroundUrl');

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { id } = req.params;
        const { paragraph } = req.body;

        const aboutUs = await AboutUs.findById(id);

        if (!aboutUs) {
            return res.status(404).json({ error: "about us data not found" });
        }

        // Update text fields
        aboutUs.paragraph = paragraph || aboutUs.paragraph;

        // Update backgroundUrl if a new file is uploaded
        if (req.file) {
            aboutUs.backgroundUrl = `/uploads/${req.file.filename}`;
        }

        await aboutUs.save();

        res.status(200).json({ message: "about us data updated successfully", aboutUs });
    });
};


// Delete about us data
export const deleteAboutUs = async (req, res) => {
    const { id } = req.params;

    const aboutUs = await AboutUs.findById(id);

    if (!aboutUs) {
        return res.status(404).json({ error: "about us data not found" });
    }
    if (aboutUs.backgroundUrl) {
        //delete file from server folder
        await deleteFile(aboutUs.backgroundUrl);
    }

    await AboutUs.findByIdAndDelete(id);

    res.status(200).json({ message: "about us data deleted successfully" });
};


//add cards1 section(bookings)
export const addcards1 = async (req, res) => {
    const uploadMiddleware = upload.single('backgroundUrl');

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { title,description,days,price} = req.body;
        const backgroundUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!backgroundUrl) {
            return res.status(400).json({ error: "background is required" });
        }

        const newcard1 = new Cards1({ title, description, days, price, backgroundUrl });
        await newcard1.save();

        res.status(201).json({ message: "New card item successfully created", cards1: newcard1 });
    });
};


//get cards1 data(bookings)
export const getcards1 = async (req, res) => {
    const cards1 = await Cards1.find().sort({ createdAt: -1, _id: 1 });
    res.status(200).json(cards1);
};

//get filtered cards1(booking)
export const getFilteredcards1 = async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    
    let query = {};

    if (search) {
        query = { title: { $regex: search, $options: 'i' } };
    }

    const total = await Cards1.countDocuments(query);
    const totalPages = Math.ceil(total / limitNumber);

    const cards1 = await Cards1.find(query)
        .sort({ createdAt: -1, _id: 1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    if (cards1.length === 0) {
        return res.status(404).json({ message: "No cards found" });
    }

    res.status(200).json({
        message: "Cards retrieved successfully",
        cards: cards1,
        currentPage: pageNumber,
        totalPages: totalPages,
        totalItems: total
    });
};

// edit cards1 data(bookings)
export const editcards1 = async (req, res) => {
    const uploadMiddleware = upload.single('backgroundUrl');

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { id } = req.params;
        const { title, description, days, price } = req.body;

        const cards1 = await Cards1.findById(id);

        if (!cards1) {
            return res.status(404).json({ error: "cards1 data not found" });
        }

        // Update text fields
        cards1.title = title || cards1.title;
        cards1.description = description || cards1.description;
        cards1.days = days || cards1.days
        cards1.price = price || cards1.price

        // Update backgroundUrl if a new file is uploaded
        if (req.file) {
            cards1.backgroundUrl = `/uploads/${req.file.filename}`;
        }

        await cards1.save();

        res.status(200).json({ message: "cards1 data updated successfully", cards1 });
    });
};

// Delete cards1 data (bookings)
export const deletecards1 = async (req, res) => {
    const { id } = req.params;

    const cards1 = await Cards1.findById(id);

    if (!cards1) {
        return res.status(404).json({ error: "cards1 data not found" });
    }
    if (cards1.backgroundUrl) {
        //delete file from server folder
        await deleteFile(cards1.backgroundUrl);
    }

    await Cards1.findByIdAndDelete(id);

    res.status(200).json({ message: "cards1 data deleted successfully" });
};


//add cards2 or testimonials section
export const addcards2 = async (req, res) => {
    const uploadMiddleware = upload.single('backgroundUrl');

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { title, description } = req.body;
        const backgroundUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newcard2 = new Cards2({ title, description, backgroundUrl });
        await newcard2.save();

        res.status(201).json({ message: "New card item successfully created", cards2: newcard2 });
    });
};


//get cards2 or testimonials data
export const getcards2 = async (req, res) => {
    const cards2 = await Cards2.find().sort({ createdAt: -1, _id: 1 });
    res.status(200).json(cards2);
};

export const getSingleTestimonial = async (req, res) => {
    const { id } = req.params;
    const cards2 = await Cards2.findById(id);
    if (!cards2) {
        return res.status(404).json({ error: "cards2 data not found" });
    }
    res.status(200).json(cards2);
};

//get filtered cards 2 (testimonials)
export const getfilteredcards2 = async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    
    let query = {};
  
    if (search) {
      query = { title: { $regex: search, $options: 'i' } };
    }
  
    const total = await Cards2.countDocuments(query);
    const totalPages = Math.ceil(total / limitNumber);
  
    const cards2 = await Cards2.find(query)
      .sort({ createdAt: -1, _id: 1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);
  
    if (cards2.length === 0) {
      return res.status(404).json({ message: "No cards found" });
    }
  
    res.status(200).json({
      message: "Cards retrieved successfully",
      cards: cards2,
      currentPage: pageNumber,
      totalPages: totalPages,
      totalItems: total
    });
  };

// edit cards 2 or testimonials data
export const editcards2 = async (req, res) => {
    const uploadMiddleware = upload.single('backgroundUrl');

    uploadMiddleware(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { id } = req.params;
        const { title, description} = req.body;

        const cards2 = await Cards2.findById(id);

        if (!cards2) {
            return res.status(404).json({ error: "cards2 data not found" });
        }

        // Update text fields
        cards2.title = title || cards2.title;
        cards2.description = description || cards2.description;

        // Update backgroundUrl if a new file is uploaded
        if (req.file) {
            cards2.backgroundUrl = `/uploads/${req.file.filename}`;
        }

        await cards2.save();

        res.status(200).json({ message: "cards2 data updated successfully", cards2 });
    });
};

// Delete cards2 or testimonials data
export const deletecards2 = async (req, res) => {
    const { id } = req.params;

    const cards2 = await Cards2.findById(id);

    if (!cards2) {
        return res.status(404).json({ error: "cards2 data not found" });
    }
    if (cards2.backgroundUrl) {
        //delete file from server folder
        await deleteFile(cards2.backgroundUrl);
    }

    await Cards2.findByIdAndDelete(id);

    res.status(200).json({ message: "cards2 data deleted successfully" });
};