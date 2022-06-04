const { successResponse, errorResponse } = require("../util/response.utl");
const mongoose = require('mongoose');
const multer = require('multer');

const Film = mongoose.model("Film");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        const tempFileArr = file.originalname.split(".");
        const tempFileName = tempFileArr[0];
        const tempFileExtension = tempFileArr[1];

        cb(null, tempFileName+'-'+Date.now()+'.'+tempFileExtension);
    }
})

const uploadStorage = multer({ storage: storage })

const getUrl  = req => {
    const protocol = req.protocol;
    const host = req.get('host');

    return `${protocol}://${host}`;
}

const list = async(req, res) => {
    try {
        const films = await Film.find();
        res.send(successResponse(films));
    } catch (err) {
        res.status(500).send(errorResponse(err.message || "Some error occurred while retrieving films."));
    }
}

const create = async(req, res) => {
    try {
        const upload = uploadStorage.single('img');
    
        upload(req, res, async(error) => {
            if(error) {
                return res.send('failed');
            } else {
                const film = await new Film({
                    name: req.body.name,
                    summary: req.body.summary,
                    img: getUrl(req) + '/images/' +req.file.filename,
                }).save()
                return res.json(film);
            }
        })
    } catch (err) {
        res.status(500).send(errorResponse(err.message || "Some error occurred while retrieving films."));
    }
}

const show = async(req, res) => {
    try {
        const id = req.params.filmId;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid Id");
        }
        
        const film = await Film.findById(req.params.filmId);
        if(null == film) {
            throw new Error("Film not found");
        }
        
        res.send(successResponse(film));
    } catch (err) {
        res.status(500).send(errorResponse(err.message || "Some error occurred while retrieving films."));
    }
}

const update = async(req, res) => {
    try {
        const id = req.params.filmId;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid Id");
        }
        
        const film = await Film.findById(req.params.filmId);
        if(null == film) {
            throw new Error("Film not found");
        }
        
        const upload = uploadStorage.single('img');
    
        upload(req, res, async(error) => {
            if(error) {
                return res.send('failed');
            } else {
                film.name = req.body.name;
                film.summary = req.body.summary;
                film.img = getUrl(req) + '/images/' +req.file.filename;
                await film.save();
                return res.json(film);
            }
        })
    } catch (err) {
        res.status(500).send(errorResponse(err.message || "Some error occurred while retrieving films."));
    }
}

const remove =  async(req, res) => {
    try {
        const id = req.params.filmId;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid Id");
        }
        
        const film = await Film.findById(req.params.filmId);
        if(null == film) {
            throw new Error("Film not found");
        }
        
        await film.remove();

        res.send("film removed");
    } catch (err) {
        res.status(500).send(errorResponse(err.message || "Some error occurred while retrieving films."));
    }
}

module.exports = {
    list,
    create,
    show,
    update,
    remove
}