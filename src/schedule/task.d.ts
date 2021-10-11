
/** B站直播间订阅 */
export type BiliLiveTaskData = {
  /** bilibili UID */
  uid: number
  /** bilibili 用户名称 */
  name: string
  /** 存储任意信息 */
  info?: any
  /** 记录是否发送过 */
  flag: boolean
  /** bot信息 */
  bot: {
    id: number
    /** 订阅的群号 */
    group?: {
      /** at all */
      at: boolean
      id: number
    }[]
    /** 订阅的用户 */
    user?: number[]
  }[]
}

/** B站空间订阅 */
export type BiliSpaceTaskData = {
  /** bilibili UID */
  uid: number
  /** bilibili 用户名称 */
  name: string
  /** 动态号 */
  dynamic_id: number
  /** 字符串形式的动态号 */
  dynamic_id_str: string
  /** 发布时间戳(秒) */
  timestamp: number
  /** bot信息 */
  bot: {
    id: number
    /** 订阅的群号 */
    group?: {
      /** at all */
      at: boolean
      id: number
    }[]
    /** 订阅的用户 */
    user?: number[]
  }[]
}

/** 接口返回的实体 */
export type SpaceApiResponse = {
  code: number,
  msg: string,
  message: string,
  data: {
    has_more: number,
    cards: SpaceDynamic[],
    next_offset: number,
    _gt_: number
  }
}

/** 一条动态的实体 */
export type SpaceDynamic = {
  desc: {
    uid: number,
    type: number,
    rid: number,
    acl: number,
    view: number,
    repost: number,
    comment: number,
    like: number,
    is_liked: number,
    dynamic_id: number,
    timestamp: number,
    pre_dy_id: number,
    orig_dy_id: number,
    orig_type: number,
    user_profile: {
      info: {
        uid: number,
        uname: string,
        face: string
      },
      card: {
        official_verify: {
          type: number,
          desc: string
        }
      },
      vip: {
        vipType: number,
        vipDueDate: number,
        vipStatus: number,
        themeType: number,
        label: {
          path: string,
          text: string,
          label_theme: string,
          text_color: string,
          bg_style: number,
          bg_color: string,
          border_color: string
        },
        avatar_subscript: number,
        nickname_color: string,
        role: number,
        avatar_subscript_url: string
      },
      pendant: {
        pid: number,
        name: string,
        image: string,
        expire: number,
        image_enhance: string,
        image_enhance_frame: string
      },
      decorate_card: {
        mid: number,
        id: number,
        card_url: string,
        card_type: number,
        name: string,
        expire_time: number,
        card_type_name: string,
        uid: number,
        item_id: number,
        item_type: number,
        big_card_url: string,
        jump_url: string,
        fan: {
          is_fan: number,
          number: number,
          color: string,
          num_desc: string
        },
        image_enhance: string
      },
      rank: string,
      sign: string,
      level_info: {
        current_level: number
      }
    },
    uid_type: number,
    stype: number,
    r_type: number,
    inner_id: number,
    status: number,
    dynamic_id_str: string,
    pre_dy_id_str: string,
    orig_dy_id_str: string,
    rid_str: string
  },
  card: string,
  extend_json: string,
  extra: {
    is_space_top: number
  },
  display: {
    emoji_info: {
      emoji_details: object[]
    },
    relation: {
      status: number,
      is_follow: number,
      is_followed: number
    },
    comment_info: {
      comments: object[],
      comment_ids: string
    }
  }
}

/** 序列化后的card */
export type SpaceCard = {
  item: {
    at_control: string,
    category: string,
    description: string,
    id: number,
    is_fav: number,
    pictures: object[],
    pictures_count: number,
    reply: number,
    role: void[],
    settings: {
      copy_forbidden: string
    },
    source: void[],
    title: string,
    upload_time: number
  },
  user: {
    head_url: string,
    name: string,
    uid: number,
    vip: {
      avatar_subscript: number,
      due_date: number,
      label: {
        label_theme: string,
        path: string,
        text: string
      },
      nickname_color: string,
      status: number,
      theme_type: number,
      type: number,
      vip_pay_type: number
    }
  }
}

export type SpaceCard2 = {
  aid: number,
  attribute: number,
  cid: number,
  copyright: number,
  ctime: number,
  desc: string,
  dimension: {
    height: number,
    rotate: number,
    width: number
  },
  duration: number,
  dynamic: string,
  first_frame: string,
  jump_url: string,
  owner: {
    face: string,
    mid: number,
    name: string
  },
  pic: string,
  player_info: any,
  pubdate: number,
  rights: {
    autoplay: number,
    bp: number,
    download: number,
    elec: number,
    hd5: number,
    is_cooperation: number,
    movie: number,
    no_background: number,
    no_reprint: number,
    pay: number,
    ugc_pay: number,
    ugc_pay_preview: number
  },
  short_link: string,
  short_link_v2: string,
  stat: {
    aid: number,
    coin: number,
    danmaku: number,
    dislike: number,
    favorite: number,
    his_rank: number,
    like: number,
    now_rank: number,
    reply: number,
    share: number,
    view: number
  },
  state: number,
  tid: number,
  title: string,
  tname: string,
  videos: number
}