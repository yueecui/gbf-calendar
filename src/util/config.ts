interface Category {
    readonly sort: number;
    readonly s_class: string;
}

export const CategoryMap: Record<string, Category> = {
    '更新': { sort: 10, s_class: 'update' },
    '活动': { sort: 20, s_class: 'event' },
    '运营': { sort: 30, s_class: 'bonus' },
  }