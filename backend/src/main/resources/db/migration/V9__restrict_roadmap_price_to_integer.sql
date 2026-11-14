-- Округление существующих дробных цен до целых значений
UPDATE roadmaps SET price = ROUND(price) WHERE price != TRUNC(price);

-- Ограничение: цена дорожной карты должна быть целым числом
ALTER TABLE roadmaps ADD CONSTRAINT chk_roadmaps_price_integer CHECK (price = TRUNC(price));
