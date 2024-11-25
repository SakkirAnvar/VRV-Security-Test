import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  permissions: {
    subUser: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    roles: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    banner: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    // aboutPage: {
    //   view: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   create: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   edit: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   delete: {
    //     type: Boolean,
    //     default: false,
    //   },
    // },
    // bookingCards: {
    //   view: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   create: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   edit: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   delete: {
    //     type: Boolean,
    //     default: false,
    //   },
    // },
    packagesCards: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    testimonials: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    blogs: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    metaTagsAccess: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    category: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    enquiry: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    destination: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    newsLetter: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    contact: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
    faqs: {
      view: {
        type: Boolean,
        default: false,
      },
      create: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
    },
  },
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
