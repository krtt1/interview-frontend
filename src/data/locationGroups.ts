// src/data/locationGroups.ts

export type LocationItem = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export type LocationGroup = {
  key: string;
  title: string;
  description?: string;
  category: "office" | "border" | "support" | "vector";
  items: LocationItem[];
};

export const locationGroups: LocationGroup[] = [
  // ===============================
  // อาคารสำนักงานหลัก
  // ===============================
  {
    key: "office",
    title: "อาคารสำนักงานป้องกันควบคุมโรคที่ 1 จังหวัดเชียงใหม่",
    category: "office",
    items: [
      {
        id: "office-admin",
        name: "อาคารอำนวยการ (ตึก 1, 2, 3)",
        lat: 18.782338790203923,
        lng: 98.99784736858818,
      },
      {
        id: "office-lab",
        name: "อาคารสัตว์ทดลอง",
        lat: 18.782338790203923,
        lng: 98.99784736858818,
      },
      {
        id: "office-med",
        name: "อาคารห้องปฏิบัติการทางการแพทย์ด้านควบคุมโรค",
        lat: 18.782338790203923,
        lng: 98.99784736858818,
      },
    ],
  },

  // ===============================
  // ด่านควบคุมโรคติดต่อระหว่างประเทศ
  // ===============================
  {
    key: "border",
    title: "ด่านควบคุมโรคติดต่อระหว่างประเทศ",
    category: "border",
    items: [
      {
        id: "border-airport-cnx",
        name: "ด่านควบคุมโรค ท่าอากาศยานเชียงใหม่",
        lat: 18.7666,
        lng: 98.9627,
      },
      {
        id: "border-airport-lpt",
        name: "ด่านควบคุมโรค ท่าอากาศยานแม่ฟ้าหลวง",
        lat: 19.9524,
        lng: 99.8827,
      },
      {
        id: "border-maesai",
        name: "ด่านควบคุมโรค แม่สาย",
        lat: 20.4333,
        lng: 99.8833,
      },
      {
        id: "border-chiangkhong",
        name: "ด่านควบคุมโรค เชียงของ",
        lat: 20.2625,
        lng: 100.4042,
      },
      {
        id: "border-phan",
        name: "ด่านควบคุมโรค พาน",
        lat: 19.5536,
        lng: 99.7403,
      },
      {
        id: "border-hot",
        name: "ด่านควบคุมโรค ฮอด",
        lat: 18.1106,
        lng: 98.6267,
      },
    ],
  },

  // ===============================
  // ศูนย์สนับสนุนและพัฒนาบริการฯ
  // ===============================
  {
    key: "support",
    title: "ศูนย์สนับสนุนและพัฒนาบริการอาชีวอนามัยและสิ่งแวดล้อม",
    category: "support",
    items: [
      {
        id: "support-cnx",
        name: "ศูนย์สนับสนุนฯ จังหวัดเชียงใหม่",
        lat: 18.7900,
        lng: 98.9900,
      },
    ],
  },

  // ===============================
  // ศูนย์ควบคุมโรคติดต่อโดยแมลง (ศคม.)
  // ===============================
  {
    key: "vector",
    title: "ศูนย์ควบคุมโรคติดต่อโดยแมลง (ศคม.)",
    description: "พื้นที่รับผิดชอบ ศคม. รวม 5 แห่ง และหน่วยควบคุมฯ (คม.) 16 แห่ง",
    category: "vector",
    items: [
      {
        id: "vector-11",
        name: "ศคม. 1.1 แม่ฮ่องสอน",
        lat: 19.3020,
        lng: 97.9650,
      },
      {
        id: "vector-12",
        name: "ศคม. 1.2 ลำปาง",
        lat: 18.2920,
        lng: 99.4920,
      },
      {
        id: "vector-13",
        name: "ศคม. 1.3 เชียงราย",
        lat: 19.9072,
        lng: 99.8327,
      },
      {
        id: "vector-14",
        name: "ศคม. 1.4 เชียงใหม่",
        lat: 18.7833,
        lng: 98.9853,
      },
      {
        id: "vector-15",
        name: "ศคม. 1.5 แพร่",
        lat: 18.1446,
        lng: 100.1410,
      },
    ],
  },
];
