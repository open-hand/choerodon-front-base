package io.choerodon.base.app.service;


import java.util.List;

import com.github.pagehelper.PageInfo;
import org.springframework.data.domain.Pageable;

import io.choerodon.base.api.vo.LookupValueVO;
import io.choerodon.base.infra.dto.LookupDTO;
import io.choerodon.base.infra.dto.LookupValueDTO;

/**
 * @author superlee
 */
public interface LookupService {

    LookupDTO create(LookupDTO lookupDTO);

    PageInfo<LookupDTO> pagingQuery(Pageable pageable, String code, String description, String param);

    void delete(Long id);

    LookupDTO update(LookupDTO lookupDTO);

    LookupDTO queryById(Long id);

    LookupDTO queryByCode(String code);

    List<LookupValueVO> queryCodeValueByCode(String code);

    void check(Long lookupId, String code);
}