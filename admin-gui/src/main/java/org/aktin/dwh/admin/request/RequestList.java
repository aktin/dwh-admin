package org.aktin.dwh.admin.request;

import javax.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@XmlRootElement(name="requestList")
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(factoryMethod="createInstanceOfRequestListWrapper") //workaround for jaxb
public class RequestList {

    @XmlElement(name="request")
    public List<Request> values = new ArrayList<>();

    public RequestList() { }

    /*
    Jaxb depends on a custom constructor for unmarshalling of unknown types, even if this procedure is never performed.
    A static factory method servers here as a workaround, as it can be used to instantiate an instance of the class and Jaxb checks only
    for the existence of this method. This method is never called.
     */
    public static RequestList createInstanceOfRequestListWrapper() {
        return null;
    }

    public void add(Request r) {
        this.values.add(r);
    }
}