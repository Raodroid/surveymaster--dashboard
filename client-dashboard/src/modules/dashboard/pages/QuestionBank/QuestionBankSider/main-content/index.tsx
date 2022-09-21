import React from 'react';
import { QuestionBankSiderMainContentWrapper } from './style';
import { mockCategories } from 'type';
import { useTranslation } from 'react-i18next';
import useParseQueryString from '../../../../../../hooks/useParseQueryString';

const QuestionBankSiderMainContent = () => {
  const { t } = useTranslation();
  const params = useParseQueryString<{ categoryId?: string }>();
  return (
    <QuestionBankSiderMainContentWrapper>
      <div
        className={`${
          params.categoryId && 'active-status'
        } QuestionBankSiderMainContent__title`}
      >
        <h4>{t('common.questionBank')}</h4>
      </div>
      <div className={'QuestionBankSiderMainContent__body'}>
        <div className={'category-list'}>
          <div className={'a'}>
            {mockCategories.data.map(cate => (
              <div key={cate.id}>{cate.name}</div>
            ))}
          </div>
        </div>
      </div>
    </QuestionBankSiderMainContentWrapper>
  );
};

export default QuestionBankSiderMainContent;
